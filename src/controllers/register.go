package controllers

import (
	"fmt"
	"net/http"
	"os"
	"github.com/joho/godotenv"
)

func Register(w http.ResponseWriter, r *http.Request) {

	err := godotenv.Load("secrets/.env")

	if err != nil {
		fmt.Println(err)
	}

	fmt.Printf("%s\n", os.Getenv("TEST"))
}
