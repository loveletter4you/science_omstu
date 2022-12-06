package main

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/httpserver"
)

func main() {
	r := httpserver.NewServer()
	err := r.StartServer()
	fmt.Print(err.Error())
	panic(err)
}
