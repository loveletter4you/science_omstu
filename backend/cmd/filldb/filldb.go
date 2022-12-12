package main

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/filldb"
	"github.com/loveletter4u/cris/internal/storage"
	"os"
)

func main() {
	s := storage.NewStorage(storage.LocalConfig())
	file, err := os.Open("../../resources/authors.csv")
	if err != nil {
		fmt.Println(err)
		return
	}
	filldb.AuthorsFill(file, s)
}
