const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getQuizzes = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/quizzes?${params}`);
    if (!response.ok) throw new Error('Failed to fetch quizzes');
    return response.json();
};

export const updateQuiz = async (id, quizData) => {
    const response = await fetch(`${API_URL}/quizzes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData),
    });
    if (!response.ok) throw new Error('Failed to update quiz');
    return response.json();
};

export const deleteQuiz = async (id) => {
    const response = await fetch(`${API_URL}/quizzes/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete quiz');
    return response.json();
};

export const getQuestions = async (quizId) => {
    const response = await fetch(`${API_URL}/quizzes/${quizId}/questions`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return response.json();
};

export const submitResult = async (userId, quizId, score) => {
    const response = await fetch(`${API_URL}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, quiz_id: quizId, score }),
    });
    if (!response.ok) throw new Error('Failed to submit result');
    return response.json();
};

export const getUserResults = async (userId) => {
    const response = await fetch(`${API_URL}/results/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch results');
    return response.json();
};

export const getLeaderboard = async () => {
    const response = await fetch(`${API_URL}/leaderboard`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
};

export const createQuiz = async (quizData) => {
    const response = await fetch(`${API_URL}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData),
    });
    if (!response.ok) throw new Error('Failed to create quiz');
    return response.json();
};

export const addQuestion = async (questionData) => {
    const response = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
    });
    if (!response.ok) throw new Error('Failed to add question');
    return response.json();
};

export const updateQuestion = async (id, questionData) => {
    const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
    });
    if (!response.ok) throw new Error('Failed to update question');
    return response.json();
};

export const deleteQuestion = async (id) => {
    const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete question');
    return response.json();
};

// --- Categories ---

export const getCategories = async () => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
};

export const createCategory = async (categoryData) => {
    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
};

export const updateCategory = async (id, categoryData) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
};

export const deleteCategory = async (id) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return response.json();
};

// --- Users ---

export const getUsers = async () => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
};

export const updateUser = async (id, userData) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
};

// --- Analytics ---

export const getAnalyticsOverview = async () => {
    const response = await fetch(`${API_URL}/analytics/overview`);
    if (!response.ok) throw new Error('Failed to fetch analytics overview');
    return response.json();
};

export const getQuizPerformance = async () => {
    const response = await fetch(`${API_URL}/analytics/quiz-performance`);
    if (!response.ok) throw new Error('Failed to fetch quiz performance');
    return response.json();
};

export const getUserActivity = async () => {
    const response = await fetch(`${API_URL}/analytics/user-activity`);
    if (!response.ok) throw new Error('Failed to fetch user activity');
    return response.json();
};

// --- Achievements ---

export const getAchievements = async () => {
    const response = await fetch(`${API_URL}/achievements`);
    if (!response.ok) throw new Error('Failed to fetch achievements');
    return response.json();
};

export const createAchievement = async (achievementData) => {
    const response = await fetch(`${API_URL}/achievements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievementData),
    });
    if (!response.ok) throw new Error('Failed to create achievement');
    return response.json();
};

export const updateAchievement = async (id, achievementData) => {
    const response = await fetch(`${API_URL}/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievementData),
    });
    if (!response.ok) throw new Error('Failed to update achievement');
    return response.json();
};

export const deleteAchievement = async (id) => {
    const response = await fetch(`${API_URL}/achievements/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete achievement');
    return response.json();
};

// --- App Settings ---

export const getSettings = async () => {
    const response = await fetch(`${API_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
};

export const updateSetting = async (key, value) => {
    const response = await fetch(`${API_URL}/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
    });
    if (!response.ok) throw new Error('Failed to update setting');
    return response.json();
};
