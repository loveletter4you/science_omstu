package main

import (
	"github.com/loveletter4u/cris/internal/httpserver"
)

func main() {
	r := httpserver.NewServer()
	err := r.StartServer()
	panic(err)
}
