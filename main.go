package main

import (
	"github.com/mporeapp/mpore-api/src/database"
	"github.com/mporeapp/mpore-api/src/router"
)

func main() {
	database.TestDB()

	router.SetupRoutes()
}
