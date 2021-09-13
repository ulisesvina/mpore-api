package router

import (
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func SetupRoutes() {
	r := mux.NewRouter()
	fs := http.FileServer(http.Dir("static"))
	//si queremos agregar mas opciones para las rutas simplemente usemos queryurls vales?

	r.Handle("/", fs)
	port, err := os.LookupEnv("PORT")
	if !err {
		port = ":8080"
	}

	http.ListenAndServe(port, r)

}
