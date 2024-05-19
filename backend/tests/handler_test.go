package tests

import (
	"api/handlers"
	"api/models"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gocql/gocql"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func (m *MockDB) InsertSwapper(swapper models.Swapper) error {
	args := m.Called(swapper)
	return args.Error(0)
}

func (m *MockDB) GetSwapperByUsername(username string) (*models.Swapper, error) {
	args := m.Called(username)
	return args.Get(0).(*models.Swapper), args.Error(1)
}

func (m *MockDB) InsertHashImage(hash, name, filePath string) error {
	args := m.Called(hash, name, filePath)
	return args.Error(0)
}

func TestRegisterHandler(t *testing.T) {
	mockDB := new(MockDB)
	h := &handlers.Handlers{DB: mockDB}
	handler := h.RegisterHandler()

	// Create a known AccountCreationDate without monotonic clock reading
	accountCreationDate := time.Now().Truncate(time.Second)
	swapper := models.Swapper{
		UserID:              gocql.TimeUUID(),
		Username:            "testuser",
		Email:               "test@example.com",
		Location:            "Test City",
		SwappingHistory:     []string{"History"},
		Availability:        "Available",
		ProfilePicture:      "profile.jpg",
		AccountCreationDate: accountCreationDate,
	}

	mockDB.On("InsertSwapper", mock.MatchedBy(func(s models.Swapper) bool {
		return s.UserID == swapper.UserID &&
			s.Username == swapper.Username &&
			s.Email == swapper.Email &&
			s.Location == swapper.Location &&
			s.SwappingHistory[0] == swapper.SwappingHistory[0] &&
			s.Availability == swapper.Availability &&
			s.ProfilePicture == swapper.ProfilePicture &&
			s.AccountCreationDate.Equal(swapper.AccountCreationDate)
	})).Return(nil)

	reqBody, err := json.Marshal(swapper)
	require.NoError(t, err)

	req, err := http.NewRequest("POST", "/swappers/register", bytes.NewBuffer(reqBody))
	require.NoError(t, err)

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	require.Equal(t, http.StatusCreated, rr.Code)

	var responseSwapper models.Swapper
	err = json.NewDecoder(rr.Body).Decode(&responseSwapper)
	require.NoError(t, err)
	require.Equal(t, swapper.Username, responseSwapper.Username)

	mockDB.AssertExpectations(t)
}

func TestRegisterHandlerInvalidMethod(t *testing.T) {
	mockDB := new(MockDB)
	h := &handlers.Handlers{DB: mockDB}
	handler := h.RegisterHandler()

	req, err := http.NewRequest("GET", "/swappers/register", nil)
	require.NoError(t, err)

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	require.Equal(t, http.StatusMethodNotAllowed, rr.Code)
}

func TestRegisterHandlerInvalidBody(t *testing.T) {
	mockDB := new(MockDB)
	h := &handlers.Handlers{DB: mockDB}
	handler := h.RegisterHandler()

	req, err := http.NewRequest("POST", "/swappers/register", bytes.NewBuffer([]byte("{invalid json}")))
	require.NoError(t, err)

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	require.Equal(t, http.StatusBadRequest, rr.Code)
}

func TestLoginHandler(t *testing.T) {
	mockDB := new(MockDB)
	h := &handlers.Handlers{DB: mockDB}
	handler := h.LoginHandler()

	swapper := models.Swapper{
		UserID:              gocql.TimeUUID(),
		Username:            "testuser",
		Email:               "test@example.com",
		Location:            "Test City",
		SwappingHistory:     []string{"History"},
		Availability:        "Available",
		ProfilePicture:      "profile.jpg",
		AccountCreationDate: time.Now().Truncate(time.Second),
	}

	mockDB.On("GetSwapperByUsername", "testuser").Return(&swapper, nil)

	reqBody, err := json.Marshal(map[string]string{"username": "testuser"})
	require.NoError(t, err)

	req, err := http.NewRequest("POST", "/swappers/login", bytes.NewBuffer(reqBody))
	require.NoError(t, err)

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var responseSwapper models.Swapper
	err = json.NewDecoder(rr.Body).Decode(&responseSwapper)
	require.NoError(t, err)
	require.Equal(t, swapper.Username, responseSwapper.Username)

	mockDB.AssertExpectations(t)
}

func TestLoginHandlerInvalidMethod(t *testing.T) {
	mockDB := new(MockDB)
	h := &handlers.Handlers{DB: mockDB}
	handler := h.LoginHandler()

	req, err := http.NewRequest("GET", "/swappers/login", nil)
	require.NoError(t, err)

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	require.Equal(t, http.StatusMethodNotAllowed, rr.Code)
}

func TestLoginHandlerInvalidBody(t *testing.T) {
	mockDB := new(MockDB)
	h := &handlers.Handlers{DB: mockDB}
	handler := h.LoginHandler()

	req, err := http.NewRequest("POST", "/swappers/login", bytes.NewBuffer([]byte("{invalid json}")))
	require.NoError(t, err)

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	require.Equal(t, http.StatusBadRequest, rr.Code)
}
