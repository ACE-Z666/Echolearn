const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(isLogin ? {
                email: formData.email,
                password: formData.password
            } : formData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('userToken', data.data.token);
            // Handle successful login/register
            console.log('Success:', data);
        } else {
            // Handle error response
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle error appropriately in your UI
    }
}; 