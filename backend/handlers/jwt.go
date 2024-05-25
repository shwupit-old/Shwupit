package handlers

import (
	"api/model"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// JWT secret key
var jwtSecretKey = []byte("eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNjM0NzM5MSwiaWF0IjoxNzE2MzQ3MzkxfQ.TclsttR3wTaNfIx-KIb_HUQzskJPjWeCkOSi6TcFsFA")

// GenerateJWT generates a JWT token for the user
func GenerateJWT(user model.User) (string, error) {
	claims := &jwt.StandardClaims{
		ExpiresAt: time.Now().Add(time.Hour * 72).Unix(),
		Subject:   user.ID.String(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecretKey)
}
