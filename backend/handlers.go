package main

import (
	"encoding/json"
	"log"
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type User struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}
type ArmstrongNumber struct {
	ID        int       `json:"id"`
	Number    int       `json:"number"`
	CreatedAt time.Time `json:"created_at"`
}
type UserWithNumbers struct {
	ID        int             `json:"id"`
	Email     string          `json:"email"`
	CreatedAt time.Time       `json:"created_at"`
	Numbers   json.RawMessage `json:"armstrong_numbers"`
}

func RegisterUser(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cleanEmail := strings.ToLower(strings.TrimSpace(req.Email))
	sqlStatement := `INSERT INTO users (email) VALUES ($1) RETURNING user_id, email, created_at`
	var newUser User
	err := DB.QueryRow(sqlStatement, cleanEmail).Scan(&newUser.ID, &newUser.Email, &newUser.CreatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user or email already exists"})
		return
	}
	c.JSON(http.StatusCreated, newUser)
}
func LoginUser(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cleanEmail := strings.ToLower(strings.TrimSpace(req.Email))
	log.Printf("Attempting to find user with email: %s", cleanEmail)
	sqlStatement := `SELECT user_id, email, created_at FROM users WHERE lower(email) = $1`
	var user User
	err := DB.QueryRow(sqlStatement, cleanEmail).Scan(&user.ID, &user.Email, &user.CreatedAt)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}
func isArmstrong(n int) bool {
	if n < 0 {
		return false
	}
	s := strconv.Itoa(n)
	numDigits := len(s)
	sum := 0.0
	for _, digitChar := range s {
		digit, _ := strconv.Atoi(string(digitChar))
		sum += math.Pow(float64(digit), float64(numDigits))
	}
	return int(sum) == n
}
func VerifyOnly(c *gin.Context) {
	numberStr := c.Param("number")
	number, err := strconv.Atoi(numberStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid number format"})
		return
	}
	if isArmstrong(number) {
		c.JSON(http.StatusOK, gin.H{"is_armstrong": true, "message": "This is an Armstrong number."})
	} else {
		c.JSON(http.StatusOK, gin.H{"is_armstrong": false, "message": "This is not an Armstrong number."})
	}
}
func SaveNumber(c *gin.Context) {
	var req struct {
		Number int `json:"number" binding:"required"`
		UserID int `json:"user_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	sqlStatement := `INSERT INTO armstrong_numbers (user_id, number) VALUES ($1, $2)`
	_, err := DB.Exec(sqlStatement, req.UserID, req.Number)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save number"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Number saved successfully."})
}
func GetUserNumbers(c *gin.Context) {
	userID := c.Param("userId")
	sqlStatement := `SELECT id, number, created_at FROM armstrong_numbers WHERE user_id = $1 ORDER BY created_at DESC`
	rows, err := DB.Query(sqlStatement, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve numbers"})
		return
	}
	defer rows.Close()
	numbers := []ArmstrongNumber{}
	for rows.Next() {
		var num ArmstrongNumber
		if err := rows.Scan(&num.ID, &num.Number, &num.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan row"})
			return
		}
		numbers = append(numbers, num)
	}
	c.JSON(http.StatusOK, numbers)
}
func GetAllUsers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit
	sqlStatement := `
		SELECT
			u.user_id, u.email, u.created_at,
			COALESCE(
				json_agg(json_build_object('id', an.id, 'number', an.number, 'created_at', an.created_at) ORDER BY an.created_at DESC) 
				FILTER (WHERE an.id IS NOT NULL),
				'[]'::json
			) AS armstrong_numbers
		FROM users u
		LEFT JOIN armstrong_numbers an ON u.user_id = an.user_id
		GROUP BY u.user_id
		ORDER BY u.created_at DESC
		LIMIT $1 OFFSET $2`
	rows, err := DB.Query(sqlStatement, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve users"})
		return
	}
	defer rows.Close()
	users := []UserWithNumbers{}
	for rows.Next() {
		var user UserWithNumbers
		if err := rows.Scan(&user.ID, &user.Email, &user.CreatedAt, &user.Numbers); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan user row"})
			return
		}
		users = append(users, user)
	}
	c.JSON(http.StatusOK, users)
}
