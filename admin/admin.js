// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalItems = 0;
        this.enquiries = [];
        this.filteredEnquiries = [];
        this.currentEnquiry = null;
        this.apiBase = (typeof window !== 'undefined' && window.API_BASE_URL) ? window.API_BASE_URL : 'https://advfx-backend-1.onrender.com';
        this.authToken = localStorage.getItem('adminToken');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuth();
    }

    bindEvents() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        
        // Search and filters
        document.getElementById('searchInput').addEventListener('input', () => this.applyFilters());
        document.getElementById('courseFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('statusFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('dateFilter').addEventListener('change', () => this.applyFilters());
        
        // Action buttons
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadEnquiries());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        
        // Modal events
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        document.getElementById('updateStatusBtn').addEventListener('click', () => this.updateEnquiryStatus());
        document.getElementById('deleteEnquiryBtn').addEventListener('click', () => this.deleteEnquiry());
        
        // Pagination
        document.getElementById('prevBtn').addEventListener('click', () => this.changePage(this.currentPage - 1));
        document.getElementById('nextBtn').addEventListener('click', () => this.changePage(this.currentPage + 1));
        
        // Close modal on outside click
        document.getElementById('enquiryModal').addEventListener('click', (e) => {
            if (e.target.id === 'enquiryModal') {
                this.closeModal();
            }
        });
    }

    checkAuth() {
        if (this.authToken) {
            this.showDashboard();
            this.loadEnquiries();
        } else {
            this.showLogin();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            this.showLoading(true);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);
            
            const response = await fetch(`${this.apiBase}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            const result = await response.json();
            
            if (response.ok) {
                this.authToken = result.token;
                localStorage.setItem('adminToken', this.authToken);
                this.showDashboard();
                this.loadEnquiries();
                this.showToast('Login successful!', 'success');
            } else {
                throw new Error(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.name === 'AbortError') {
                this.showToast('❌ Backend took too long (e.g. Render cold start). Wait a minute and try again.', 'error');
            } else if (error.message === 'Failed to fetch' || error instanceof TypeError) {
                this.showToast('❌ Cannot reach backend. Check it is deployed and CORS allows this site.', 'error');
                this.showServerInstructions();
            } else {
                this.showToast(error.message || 'Login failed. Please try again.', 'error');
            }
        } finally {
            this.showLoading(false);
        }
    }

    handleLogout() {
        this.authToken = null;
        localStorage.removeItem('adminToken');
        this.showLogin();
        this.showToast('Logged out successfully', 'success');
    }

    async loadEnquiries() {
        try {
            this.showLoading(true);
            
            const response = await fetch(`${this.apiBase}/api/admin/enquiries`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 401) {
                this.handleLogout();
                return;
            }
            
            const payload = await response.json();
            
            if (response.ok && payload.success) {
                this.enquiries = payload.data || [];
                this.totalItems = payload.pagination?.total_items || this.enquiries.length;
                this.applyFilters();
                this.loadStats();
                this.loadCourseFilter();
            } else {
                throw new Error(payload.message || 'Failed to load enquiries');
            }
        } catch (error) {
            console.error('Load enquiries error:', error);
            this.showToast(error.message || 'Failed to load enquiries', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async loadStats() {
        try {
            const response = await fetch(`${this.apiBase}/api/admin/stats`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const payload = await response.json();
                const stats = payload.data || payload; // support both formats
                this.updateStatsDisplay(stats);
            }
        } catch (error) {
            console.error('Load stats error:', error);
        }
    }

    updateStatsDisplay(stats) {
        document.getElementById('totalEnquiries').textContent = stats.total || 0;
        document.getElementById('todayEnquiries').textContent = stats.today || 0;
        document.getElementById('popularCourse').textContent = stats.popularCourse || '-';
        document.getElementById('pendingEnquiries').textContent = stats.pending || 0;
    }

    loadCourseFilter() {
        const courses = [...new Set(this.enquiries.map(e => e.course))].filter(Boolean);
        const courseFilter = document.getElementById('courseFilter');
        
        // Clear existing options except "All Courses"
        courseFilter.innerHTML = '<option value="">All Courses</option>';
        
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            courseFilter.appendChild(option);
        });
    }

    applyFilters() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const courseFilter = document.getElementById('courseFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;
        
        this.filteredEnquiries = this.enquiries.filter(enquiry => {
            const matchesSearch = !searchTerm || 
                enquiry.name.toLowerCase().includes(searchTerm) ||
                enquiry.email.toLowerCase().includes(searchTerm) ||
                enquiry.phone.includes(searchTerm);
            
            const matchesCourse = !courseFilter || enquiry.course === courseFilter;
            const matchesStatus = !statusFilter || enquiry.status === statusFilter;
            
            let matchesDate = true;
            if (dateFilter) {
                const enquiryDate = new Date(enquiry.submissionDate).toDateString();
                const filterDate = new Date(dateFilter).toDateString();
                matchesDate = enquiryDate === filterDate;
            }
            
            return matchesSearch && matchesCourse && matchesStatus && matchesDate;
        });
        
        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
    }

    renderTable() {
        const tbody = document.getElementById('enquiriesTableBody');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageItems = this.filteredEnquiries.slice(startIndex, endIndex);
        
        tbody.innerHTML = '';
        
        if (pageItems.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #888;">
                        No enquiries found
                    </td>
                </tr>
            `;
            return;
        }
        
        pageItems.forEach(enquiry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${enquiry.name}</td>
                <td>${enquiry.phone}</td>
                <td>${enquiry.email}</td>
                <td>${enquiry.course}</td>
                <td>${this.formatDate(enquiry.submissionDate)}</td>
                <td>
                    <span class="status-badge status-${enquiry.status || 'pending'}">
                        ${(enquiry.status || 'pending').toUpperCase()}
                    </span>
                </td>
                <td>
                    <div class="action-buttons-table">
                        <button class="btn-small btn-view" onclick="adminDashboard.viewEnquiry('${enquiry.id}')">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        <button class="btn-small btn-delete" onclick="adminDashboard.confirmDelete('${enquiry.id}')">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredEnquiries.length / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredEnquiries.length);
        
        // Update pagination info
        document.getElementById('paginationInfo').textContent = 
            `Showing ${startItem}-${endItem} of ${this.filteredEnquiries.length} entries`;
        
        // Update pagination buttons
        document.getElementById('prevBtn').disabled = this.currentPage <= 1;
        document.getElementById('nextBtn').disabled = this.currentPage >= totalPages;
        
        // Update page numbers
        const pageNumbers = document.getElementById('pageNumbers');
        pageNumbers.innerHTML = '';
        
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('span');
            pageBtn.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => this.changePage(i));
            pageNumbers.appendChild(pageBtn);
        }
    }

    changePage(page) {
        const totalPages = Math.ceil(this.filteredEnquiries.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.renderPagination();
        }
    }

    viewEnquiry(id) {
        const enquiry = this.enquiries.find(e => e.id === id);
        if (!enquiry) return;
        
        this.currentEnquiry = enquiry;
        
        // Populate modal
        document.getElementById('modalName').textContent = enquiry.name;
        document.getElementById('modalPhone').textContent = enquiry.phone;
        document.getElementById('modalEmail').textContent = enquiry.email;
        document.getElementById('modalAddress').textContent = enquiry.address || 'Not specified';
        document.getElementById('modalCourse').textContent = enquiry.course;
        document.getElementById('modalMessage').textContent = enquiry.message || 'No message';
        document.getElementById('modalDate').textContent = this.formatDate(enquiry.submissionDate);
        document.getElementById('modalStatus').value = enquiry.status || 'pending';
        
        // Show modal
        document.getElementById('enquiryModal').style.display = 'block';
    }

    async updateEnquiryStatus() {
        if (!this.currentEnquiry) return;
        
        const newStatus = document.getElementById('modalStatus').value;
        
        try {
            this.showLoading(true);
            
            const response = await fetch(`${this.apiBase}/api/admin/enquiries/${this.currentEnquiry.id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            const payload = await response.json();
            
            if (response.ok && payload.success) {
                // Update local data
                const enquiry = this.enquiries.find(e => e.id === this.currentEnquiry.id);
                if (enquiry) {
                    enquiry.status = newStatus;
                }
                
                this.applyFilters();
                this.closeModal();
                this.showToast('Status updated successfully!', 'success');
            } else {
                throw new Error(payload.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Update status error:', error);
            this.showToast(error.message || 'Failed to update status', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    confirmDelete(id) {
        if (confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
            this.deleteEnquiryById(id);
        }
    }

    async deleteEnquiry() {
        if (!this.currentEnquiry) return;
        
        if (confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
            await this.deleteEnquiryById(this.currentEnquiry.id);
            this.closeModal();
        }
    }

    async deleteEnquiryById(id) {
        try {
            this.showLoading(true);
            
            const response = await fetch(`${this.apiBase}/api/admin/enquiries/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const payload = await response.json();
            
            if (response.ok && payload.success) {
                // Remove from local data
                this.enquiries = this.enquiries.filter(e => e.id !== id);
                this.applyFilters();
                this.showToast('Enquiry deleted successfully!', 'success');
            } else {
                throw new Error(payload.message || 'Failed to delete enquiry');
            }
        } catch (error) {
            console.error('Delete enquiry error:', error);
            this.showToast(error.message || 'Failed to delete enquiry', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async exportData() {
        try {
            this.showLoading(true);
            
            const response = await fetch(`${this.apiBase}/api/admin/export?format=csv`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `enquiries_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                this.showToast('Data exported successfully!', 'success');
            } else {
                throw new Error('Failed to export data');
            }
        } catch (error) {
            console.error('Export error:', error);
            this.showToast(error.message || 'Failed to export data', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    closeModal() {
        document.getElementById('enquiryModal').style.display = 'none';
        this.currentEnquiry = null;
    }

    showLogin() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (show) {
            spinner.classList.remove('hidden');
        } else {
            spinner.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add toast styles if not already added
        if (!document.querySelector('#admin-toast-styles')) {
            const toastStyles = document.createElement('style');
            toastStyles.id = 'admin-toast-styles';
            toastStyles.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 10001;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    max-width: 350px;
                }
                
                .toast-success {
                    background: linear-gradient(135deg, #00ff88, #00cc6a);
                }
                
                .toast-error {
                    background: linear-gradient(135deg, #ff6b6b, #ff5252);
                }
                
                .toast-info {
                    background: linear-gradient(135deg, #42a5f5, #2196f3);
                }
                
                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .toast-content i {
                    font-size: 18px;
                }
                
                .toast.show {
                    transform: translateX(0);
                }
            `;
            document.head.appendChild(toastStyles);
        }
        
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showServerInstructions() {
        // Create a modal with server startup instructions
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>🚨 Backend Server Not Running</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>The backend server needs to be started before you can login.</strong></p>
                    
                    <h4>🚀 Quick Fix:</h4>
                    <ol>
                        <li>Go to your website folder: <code>c:\\Users\\Karan\\Desktop\\youtube\\website</code></li>
                        <li>Double-click <strong>"start-backend.bat"</strong></li>
                        <li>Wait for "Server running on port 3000" message</li>
                        <li>Come back and try logging in again</li>
                    </ol>
                    
                    <h4>🔧 Alternative Method:</h4>
                    <ol>
                        <li>Open terminal in the <code>backend</code> folder</li>
                        <li>Run: <code>npm start</code></li>
                        <li>Keep the terminal window open</li>
                    </ol>
                    
                    <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin-top: 15px;">
                        <strong>💡 Tip:</strong> Use "start-backend-service.bat" to run the server in background!
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="location.reload()">🔄 Retry Login</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}

// Initialize dashboard when DOM is loaded
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});