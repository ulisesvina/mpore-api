package main

import (
	"fmt"

	"github.com/joho/godotenv"
	"github.com/mporeapp/mpore-api/src/database"
	"github.com/mporeapp/mpore-api/src/router"
)

func main() {
	err := godotenv.Load("secrets/.env")

	if err != nil {
		fmt.Println(err)
	}

	database.GetConnection()
	router.SetupRoutes()
}
