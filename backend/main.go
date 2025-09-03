package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	InitDB()
	router := gin.Default()
	router.Use(cors.Default())
	router.POST("/api/users", RegisterUser)
	router.POST("/api/users/login", LoginUser)
	router.GET("/api/verify/:number", VerifyOnly)
	router.POST("/api/save", SaveNumber)
	router.GET("/api/users/:userId/numbers", GetUserNumbers)
	router.GET("/api/users/all", GetAllUsers)
	router.Run(":8080")
}
