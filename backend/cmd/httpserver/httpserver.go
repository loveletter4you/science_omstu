package main

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/httpserver"
)

//Точка входа в приложение

func main() {
	r := httpserver.NewServer()
	err := r.StartServer()
	fmt.Print(err.Error())
	panic(err)
}
