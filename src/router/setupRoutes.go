package router

import (
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/mporeapp/mpore-api/src/controllers"
)

func SetupRoutes() {

	r := mux.NewRouter()

	port, err := os.LookupEnv("PORT")
	if !err {
		port = ":8080"
	}

	r.HandleFunc("/auth/register", controllers.Register).Methods("POST")

	http.ListenAndServe(port, r)
}
