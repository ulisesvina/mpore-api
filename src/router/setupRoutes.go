package router

import (
	"fmt"
	"net/http"
	"os"
	"github.com/gorilla/mux"
)

func register(w http.ResponseWriter, r *http.Request) {
	fmt.Println("register")
}

func SetupRoutes() {
	fmt.Println(buffer)

 	r := mux.NewRouter() 

	port, err := os.LookupEnv("PORT")
	if !err {
		port = ":8080"
	}

	r.HandleFunc("/auth/register", register).Methods("POST")

	http.ListenAndServe(port, r)
}