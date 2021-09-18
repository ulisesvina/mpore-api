package database

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB = getConnection()
)

func getConnection() *gorm.DB {
	databaseURL, exist := os.LookupEnv("DATABASE_URL")
	if !exist {
		databaseURL = "postgresql://postgres@127.0.0.1:5432/mpore"
		//estamos usando el puerto por default de postgresql en caso de que se este usando en localhost
	}

	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	return db
}

// esto solo es para probar
func TestDB() {

	DB.Table("users").Create(&map[string]interface{}{"username": "cummaster", "email": "com@asdf", "hashed_password": "cumaasdfasdf"})
	res := []map[string]interface{}{}
	DB.Table("users").Find(&res)
	for _, v := range res {
		fmt.Println(v)
	}
}
