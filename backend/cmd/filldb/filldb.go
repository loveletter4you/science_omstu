package main

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/filldb"
	"github.com/loveletter4u/cris/internal/storage"
	"os"
)

func main() {
	s := storage.NewStorage(storage.NewConfig())
	file, err := os.Open("./authors.csv")
	if err != nil {
		fmt.Println(err)
		return
	}
	filldb.AuthorsFill(file, s)
}
