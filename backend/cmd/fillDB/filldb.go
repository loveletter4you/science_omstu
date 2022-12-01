package main

import (
	"fmt"
	"github.com/loveletter4u/cris/internal/filldb"
	"github.com/loveletter4u/cris/internal/storage"
	"os"
)

func main() {
	s := storage.NewStorage(storage.NewConfig())
	file, err := os.Open("/home/valery/cris/backend/cmd/fillDB/2022-11-28out.csv")
	if err != nil {
		fmt.Println(err)
		return
	}
	filldb.AuthorsFill(file, s)
}
