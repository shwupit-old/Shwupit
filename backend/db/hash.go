package db

import (
	"fmt"
	"math"
	"strings"
	"time"
)

var supportedFileTypes = []string{"jpg", "png"}

func GenerateHash(filename string) (string, error) {
	if filename == "" {
		return "", fmt.Errorf("filename cannot be empty")
	}

	fileType := getFileType(filename)
	if !isSupportedFileType(fileType) {
		return "", fmt.Errorf("unsupported file type: %s", fileType)
	}

	fileTypeRep := convertToASCII(fileType)
	fileTypeNumRep := convertToNumberRep(fileType)
	countBeforeType := countInFile(filename)
	fileBeforeHash := filename[:len(filename)-len(fileType)-1]
	fileAfterHash := convertToHash(fileBeforeHash, countBeforeType)

	currentDateTime := time.Now().Format("20060102150405")
	completeHash := fmt.Sprintf("%s%s%s%d%s", fileTypeNumRep, fileTypeRep, fileAfterHash, countBeforeType, currentDateTime)
	return completeHash, nil
}

func convertToASCII(fileType string) string {
	var temp strings.Builder
	for _, char := range fileType {
		temp.WriteString(fmt.Sprintf("%d", int(char)))
	}
	return temp.String()
}

func convertToNumberRep(fileType string) string {
	var numRep strings.Builder
	for _, char := range fileType {
		numRep.WriteString(fmt.Sprintf("%d", int(char)))
	}
	return numRep.String()
}

func getFileType(filename string) string {
	splitted := strings.Split(filename, ".")
	if len(splitted) > 1 {
		return splitted[len(splitted)-1]
	}
	return ""
}

func isSupportedFileType(fileType string) bool {
	for _, supportedType := range supportedFileTypes {
		if supportedType == fileType {
			return true
		}
	}
	return false
}

func countInFile(filename string) int {
	count := 0
	for _, char := range filename {
		if char == '.' {
			break
		}
		count++
	}
	return count
}

func convertToHash(fileToHash string, count int) string {
	if count <= 0 || len(fileToHash) == 0 {
		return ""
	}
	temp := ""
	oneQuarter := int(math.Floor(float64(count) / 4))
	threeQuarters := int(math.Floor(float64(count) * 3 / 4))
	middle := int(math.Floor(float64(count) / 2))

	if len(fileToHash) > 1 {
		oneQuarterStr := string(fileToHash[oneQuarter])
		threeQuartersStr := string(fileToHash[threeQuarters])
		middleStr := string(fileToHash[middle])

		temp += oneQuarterStr
		temp += threeQuartersStr
		temp += middleStr
	}

	return temp
}
