package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/loveletter4u/cris/internal/filldb"
	"github.com/loveletter4u/cris/internal/storage"
	"net/http"
	"os"
)

func FillAuthors(s *storage.Storage) func(c *gin.Context) {
	return func(c *gin.Context) {
		authors, err := s.Author().GetAuthors()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if len(authors) != 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "DB already filled"})
		}

		file, err := os.Open("/backend/resources/authors.csv")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		err = filldb.AuthorsFill(file, s)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "OK"})
	}
}
