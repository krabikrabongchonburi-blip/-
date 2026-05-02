<style>
  /* ==========================================
 * ๐จ Event Calendar - Styles (style.html)
 * ==========================================
 * V8 Runtime Compatible
 * Google Fonts: Kanit
 * Responsive Design
 * ========================================== */

  /* ==========================================
 * ๐“ฆ IMPORTS & VARIABLES
 * ========================================== */
  @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap');

  :root {
    /* Primary Colors */
    --primary: #667eea;
    --primary-dark: #5a67d8;
    --primary-light: #a3bffa;
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    /* Secondary Colors */
    --secondary: #48bb78;
    --secondary-dark: #38a169;

    /* Accent Colors */
    --accent: #ed8936;
    --danger: #f56565;
    --warning: #ecc94b;
    --info: #4299e1;
    --success: #48bb78;

    /* Neutral Colors */
    --dark: #1a202c;
    --gray-900: #1a202c;
    --gray-800: #2d3748;
    --gray-700: #4a5568;
    --gray-600: #718096;
    --gray-500: #a0aec0;
    --gray-400: #cbd5e0;
    --gray-300: #e2e8f0;
    --gray-200: #edf2f7;
    --gray-100: #f7fafc;
    --gray-50: #fafbfc;
    --white: #ffffff;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

    /* Border Radius */
    --radius-sm: 0.25rem;
    --radius: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-full: 9999px;

    /* Transitions */
    --transition-fast: 150ms ease;
    --transition: 200ms ease;
    --transition-slow: 300ms ease;

    /* Z-Index */
    --z-dropdown: 1000;
    --z-modal: 1050;
    --z-loader: 9999;
  }

  /* ==========================================
 * ๐” RESET & BASE
 * ========================================== */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Utility Classes */
  .hidden {
    display: none !important;
  }

  .text-center {
    text-align: center;
  }

  .mt-2 {
    margin-top: 0.5rem;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Kanit', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);
    min-height: 100vh;
    color: var(--gray-800);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: var(--primary);
    text-decoration: none;
    transition: color var(--transition);
  }

  a:hover {
    color: var(--primary-dark);
  }

  img {
    max-width: 100%;
    height: auto;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input,
  select,
  textarea {
    font-family: inherit;
    font-size: 1rem;
  }

  /* ==========================================
 * ๐” LOADER / SPINNER
 * ========================================== */
  .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(26, 32, 44, 0.85);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: var(--z-loader);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-slow);
  }

  .loader-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .loader-spinner {
    width: 60px;
    height: 60px;
    position: relative;
  }

  .loader-spinner::before,
  .loader-spinner::after {
    content: '';
    position: absolute;
    border-radius: 50%;
  }

  .loader-spinner::before {
    width: 100%;
    height: 100%;
    border: 4px solid transparent;
    border-top-color: var(--primary);
    border-right-color: var(--primary);
    animation: spin 1s linear infinite;
  }

  .loader-spinner::after {
    width: 70%;
    height: 70%;
    top: 15%;
    left: 15%;
    border: 4px solid transparent;
    border-bottom-color: var(--secondary);
    border-left-color: var(--secondary);
    animation: spin 0.8s linear infinite reverse;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .loader-text {
    color: var(--white);
    margin-top: 1.5rem;
    font-size: 1.1rem;
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  .loader-dots {
    display: inline-flex;
    gap: 4px;
    margin-left: 8px;
  }

  .loader-dots span {
    width: 6px;
    height: 6px;
    background: var(--white);
    border-radius: 50%;
    animation: bounce 1.4s ease-in-out infinite;
  }

  .loader-dots span:nth-child(1) {
    animation-delay: 0s;
  }

  .loader-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loader-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes bounce {

    0%,
    60%,
    100% {
      transform: translateY(0);
    }

    30% {
      transform: translateY(-8px);
    }
  }

  /* ==========================================
 * ๐” LOGIN MODAL
 * ========================================== */
  #loginModal {
    background: var(--primary-gradient);
  }

  #loginModal.modal-overlay {
    display: none;
  }

  #loginModal.modal-overlay.active {
    display: flex;
  }

  .login-card {
    background: var(--white);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    animation: slideUp 0.5s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-logo {
    width: 80px;
    height: 80px;
    background: var(--primary-gradient);
    border-radius: var(--radius-full);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto 1rem;
    font-size: 2.5rem;
  }

  .login-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: 0.5rem;
  }

  .login-subtitle {
    color: var(--gray-600);
    font-size: 0.95rem;
  }

  /* ==========================================
 * ๐“ FORMS
 * ========================================== */
  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-label {
    display: block;
    font-weight: 500;
    color: var(--gray-700);
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .form-label.required::after {
    content: ' *';
    color: var(--danger);
  }

  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid var(--gray-300);
    border-radius: var(--radius);
    font-size: 1rem;
    transition: all var(--transition);
    background: var(--white);
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }

  .form-input::placeholder {
    color: var(--gray-500);
  }

  .form-input.error {
    border-color: var(--danger);
  }

  .form-textarea {
    min-height: 100px;
    resize: vertical;
  }

  .form-select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
    padding-right: 2.5rem;
  }

  .form-checkbox {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  .form-checkbox input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: var(--primary);
    cursor: pointer;
  }

  .input-group {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-500);
    font-size: 1.25rem;
  }

  .input-group .form-input {
    padding-left: 3rem;
  }

  /* Color Picker */
  .color-picker-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .color-picker {
    width: 50px;
    height: 40px;
    border: 2px solid var(--gray-300);
    border-radius: var(--radius);
    cursor: pointer;
    padding: 2px;
  }

  .color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  .color-picker::-webkit-color-swatch {
    border: none;
    border-radius: calc(var(--radius) - 4px);
  }

  /* Date & Time Inputs */
  .datetime-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .datetime-group.single {
    grid-template-columns: 1fr;
  }

  /* ==========================================
 * ๐” BUTTONS
 * ========================================== */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    transition: all var(--transition);
    text-decoration: none;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--primary-gradient);
    color: var(--white);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.35);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45);
  }

  .btn-secondary {
    background: var(--gray-200);
    color: var(--gray-700);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--gray-300);
  }

  .btn-success {
    background: var(--success);
    color: var(--white);
  }

  .btn-success:hover:not(:disabled) {
    background: var(--secondary-dark);
  }

  .btn-danger {
    background: var(--danger);
    color: var(--white);
  }

  .btn-danger:hover:not(:disabled) {
    background: #e53e3e;
  }

  .btn-outline {
    background: transparent;
    border: 2px solid var(--primary);
    color: var(--primary);
  }

  .btn-outline:hover:not(:disabled) {
    background: var(--primary);
    color: var(--white);
  }

  .btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .btn-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }

  .btn-block {
    width: 100%;
  }

  .btn-icon {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: var(--radius);
  }

  .btn-icon.sm {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }

  .btn-group {
    display: flex;
    gap: 0.5rem;
  }

  /* ==========================================
 * ๐  HEADER
 * ========================================== */
  .app-header {
    background: var(--white);
    box-shadow: var(--shadow);
    position: sticky;
    top: 0;
    z-index: var(--z-dropdown);
  }

  .header-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0.75rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .header-logo {
    width: 45px;
    height: 45px;
    background: var(--primary-gradient);
    border-radius: var(--radius);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
  }

  .header-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--gray-800);
  }

  .header-subtitle {
    font-size: 0.8rem;
    color: var(--gray-600);
  }

  .header-nav {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-user {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: var(--gray-100);
    border-radius: var(--radius-full);
  }

  .header-user-avatar {
    width: 36px;
    height: 36px;
    background: var(--primary-gradient);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--white);
    font-weight: 600;
  }

  .header-user-info {
    display: flex;
    flex-direction: column;
  }

  .header-user-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--gray-800);
  }

  .header-user-role {
    font-size: 0.75rem;
    color: var(--gray-600);
  }

  /* ==========================================
 * ๐“… CALENDAR TOOLBAR
 * ========================================== */
  .calendar-toolbar {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    padding: 1rem 1.5rem;
    margin: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .toolbar-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .toolbar-nav-btn {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--gray-100);
    border: none;
    border-radius: var(--radius);
    color: var(--gray-700);
    cursor: pointer;
    transition: all var(--transition);
    font-size: 1.25rem;
  }

  .toolbar-nav-btn:hover {
    background: var(--primary);
    color: var(--white);
  }

  .toolbar-today-btn {
    padding: 0.5rem 1rem;
    background: var(--primary-gradient);
    color: var(--white);
    border: none;
    border-radius: var(--radius);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
  }

  .toolbar-today-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.35);
  }

  .toolbar-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--gray-800);
    text-align: center;
    min-width: 250px;
  }

  .toolbar-views {
    display: flex;
    background: var(--gray-100);
    border-radius: var(--radius);
    padding: 4px;
  }

  .toolbar-view-btn {
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    border-radius: calc(var(--radius) - 2px);
    color: var(--gray-600);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .toolbar-view-btn.active {
    background: var(--white);
    color: var(--primary);
    box-shadow: var(--shadow-sm);
  }

  .toolbar-view-btn:hover:not(.active) {
    color: var(--gray-800);
  }

  .toolbar-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  /* ==========================================
 * ๐“… CALENDAR LAYOUT WITH SIDEBAR
 * ========================================== */
  .calendar-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1rem;
    margin: 0 1rem 1rem;
    min-height: calc(100vh - 200px);
  }

  .calendar-main {
    min-width: 0;
  }

  .calendar-container {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  /* ==========================================
 * ๐“ MONTH VIEW
 * ========================================== */
  .month-view {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
  }

  .month-header-cell {
    padding: 0.75rem;
    text-align: center;
    font-weight: 600;
    color: var(--gray-700);
    font-size: 0.9rem;
    background: var(--gray-50);
    border-bottom: 2px solid var(--gray-200);
  }

  .month-header-cell:first-child {
    border-radius: var(--radius-lg) 0 0 0;
  }

  .month-header-cell:last-child {
    border-radius: 0 var(--radius-lg) 0 0;
  }

  .month-day-cell {
    min-height: 100px;
    padding: 0.5rem;
    border: 1px solid var(--gray-200);
    background: var(--white);
    cursor: pointer;
    transition: all var(--transition);
    position: relative;
  }

  .month-day-cell:hover {
    background: var(--gray-50);
  }

  .month-day-cell.other-month {
    background: var(--gray-100);
    color: var(--gray-500);
  }

  .month-day-cell.today {
    background: rgba(102, 126, 234, 0.05);
    border-color: var(--primary);
  }

  .month-day-number {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--gray-700);
    margin-bottom: 0.5rem;
  }

  .month-day-cell.today .month-day-number {
    background: var(--primary);
    color: var(--white);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .month-day-cell.other-month .month-day-number {
    color: var(--gray-400);
  }

  .month-event-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .month-event-item {
    font-size: 0.75rem;
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    color: var(--white);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .month-event-more {
    font-size: 0.7rem;
    color: var(--primary);
    text-align: center;
    margin-top: 2px;
    cursor: pointer;
  }

  .month-event-more:hover {
    text-decoration: underline;
  }

  /* ==========================================
 * ๐“… WEEK VIEW (Calendar Grid)
 * ========================================== */
  .calendar-header {
    display: grid;
    grid-template-columns: 60px repeat(7, 1fr);
    background: var(--gray-50);
    border-bottom: 2px solid var(--gray-200);
  }

  .calendar-header-cell {
    padding: 0.75rem;
    text-align: center;
    font-weight: 600;
    color: var(--gray-700);
    font-size: 0.9rem;
  }

  .calendar-header-cell.time-col {
    background: var(--gray-100);
  }

  .calendar-header-cell .day-name {
    color: var(--gray-600);
    font-weight: 500;
    font-size: 0.8rem;
  }

  .calendar-header-cell .day-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--gray-800);
    margin-top: 2px;
  }

  .calendar-header-cell.today .day-number {
    background: var(--primary);
    color: var(--white);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 4px auto 0;
  }

  /* All Day Events Row */
  .calendar-allday-row {
    display: grid;
    grid-template-columns: 60px repeat(7, 1fr);
    min-height: 60px;
    border-bottom: 2px solid var(--gray-200);
    background: var(--gray-50);
  }

  .calendar-allday-label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: var(--gray-600);
    background: var(--gray-100);
    font-weight: 500;
  }

  .calendar-allday-cell {
    position: relative;
    border-left: 1px solid var(--gray-200);
    padding: 4px;
    min-height: 60px;
  }

  /* Calendar Body */
  .calendar-body {
    display: grid;
    grid-template-columns: 60px repeat(7, 1fr);
    max-height: calc(100vh - 280px);
    overflow-y: auto;
  }

  .calendar-time-col {
    background: var(--gray-100);
  }

  .calendar-time-slot {
    height: 60px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    font-size: 0.75rem;
    color: var(--gray-600);
    padding-top: 4px;
    border-bottom: 1px solid var(--gray-200);
  }

  .calendar-day-col {
    position: relative;
    border-left: 1px solid var(--gray-200);
  }

  .calendar-hour-slot {
    height: 60px;
    border-bottom: 1px solid var(--gray-200);
    position: relative;
  }

  .calendar-hour-slot:hover {
    background: rgba(102, 126, 234, 0.05);
  }

  /* ==========================================
 * ๐“ SIDEBAR
 * ========================================== */
  .calendar-sidebar {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 200px);
    overflow: hidden;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 2px solid var(--gray-200);
    background: var(--primary-gradient);
    color: var(--white);
  }

  /* Desktop Sidebar Collapsed */
  .calendar-sidebar.collapsed {
    width: 50px;
    min-width: 50px;
  }

  .calendar-sidebar.collapsed .sidebar-header {
    padding: 0.75rem;
    justify-content: center;
  }

  .calendar-sidebar.collapsed .sidebar-title,
  .calendar-sidebar.collapsed .sidebar-filters,
  .calendar-sidebar.collapsed .sidebar-events {
    display: none;
  }

  /* Rotate toggle button icon when collapsed */
  .calendar-sidebar.collapsed .sidebar-toggle-btn .material-icons {
    transform: rotate(180deg);
  }

  .sidebar-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }

  .sidebar-toggle-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: var(--radius);
    color: var(--white);
    cursor: pointer;
    transition: all var(--transition);
  }

  .sidebar-toggle-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .sidebar-filters {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem;
    border-bottom: 1px solid var(--gray-200);
    flex-wrap: wrap;
  }

  .sidebar-filter-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
    border: 2px solid var(--gray-300);
    background: var(--white);
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all var(--transition);
    font-weight: 500;
    color: var(--gray-600);
  }

  .sidebar-filter-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  .sidebar-filter-btn.active {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--white);
  }

  .sidebar-events {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .sidebar-event-card {
    background: var(--gray-50);
    border-radius: var(--radius);
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-left: 4px solid var(--primary);
    cursor: pointer;
    transition: all var(--transition);
  }

  .sidebar-event-card:hover {
    background: var(--gray-100);
    transform: translateX(3px);
  }

  .sidebar-event-card.activity {
    border-left-color: var(--primary);
  }

  .sidebar-event-card.substitute {
    border-left-color: var(--accent);
  }

  .sidebar-event-title {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--gray-800);
    margin-bottom: 0.25rem;
  }

  .sidebar-event-date {
    font-size: 0.75rem;
    color: var(--gray-600);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .sidebar-event-date .material-icons {
    font-size: 0.9rem;
  }

  .sidebar-event-category {
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: var(--radius-full);
    margin-top: 0.5rem;
    display: inline-block;
  }

  .sidebar-event-category.activity {
    background: rgba(102, 126, 234, 0.1);
    color: var(--primary);
  }

  .sidebar-event-category.substitute {
    background: rgba(237, 137, 54, 0.1);
    color: var(--accent);
  }

  .sidebar-empty {
    text-align: center;
    padding: 2rem;
    color: var(--gray-500);
  }

  .sidebar-empty .material-icons {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }

  /* Sidebar Event Item - New Layout */
  .sidebar-event-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 12px;
    background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
    margin-bottom: 0.75rem;
    border-left: 4px solid var(--primary);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
  }

  .sidebar-event-item:hover {
    background: linear-gradient(135deg, #f0f2ff 0%, #fff 100%);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }

  .sidebar-event-item.substitute {
    border-left-color: var(--accent);
  }

  .sidebar-event-item.activity {
    border-left-color: var(--primary);
  }

  .sidebar-event-content {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .sidebar-event-content .sidebar-event-title {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--primary);
    margin: 0;
    line-height: 1.3;
  }

  .sidebar-event-item.substitute .sidebar-event-title {
    color: var(--accent);
  }

  .sidebar-event-date-full {
    font-size: 0.8rem;
    color: var(--gray-600);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .sidebar-event-date-full .material-icons {
    font-size: 0.95rem;
    color: var(--gray-500);
  }

  .sidebar-event-badge {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 500;
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-full);
    background: rgba(102, 126, 234, 0.1);
    color: var(--primary);
    width: fit-content;
  }

  .sidebar-event-badge.substitute {
    background: rgba(237, 137, 54, 0.1);
    color: var(--accent);
  }

  /* Mobile Sidebar Toggle */
  .sidebar-mobile-toggle {
    display: none;
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 56px;
    height: 56px;
    background: var(--primary-gradient);
    color: var(--white);
    border: none;
    border-radius: 50%;
    box-shadow: var(--shadow-lg);
    cursor: pointer;
    z-index: 999;
  }

  /* ==========================================
 * ๐“ DAY POPUP MODAL
 * ========================================== */
  .day-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: var(--z-modal);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition);
  }

  .day-popup-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .day-popup {
    background: var(--white);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
    animation: popupScale 0.3s ease;
  }

  @keyframes popupScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .day-popup-header {
    background: var(--primary-gradient);
    color: var(--white);
    padding: 1rem 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .day-popup-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }

  .day-popup-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    color: var(--white);
    cursor: pointer;
    font-size: 1.5rem;
    line-height: 1;
  }

  .day-popup-close:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .day-popup-body {
    max-height: calc(80vh - 120px);
    overflow-y: auto;
    padding: 1rem;
  }

  .day-popup-event {
    background: var(--gray-50);
    border-radius: var(--radius);
    padding: 1rem;
    margin-bottom: 0.75rem;
    border-left: 4px solid var(--primary);
    cursor: pointer;
    transition: all var(--transition);
  }

  .day-popup-event:hover {
    background: var(--gray-100);
  }

  .day-popup-event-title {
    font-weight: 600;
    color: var(--gray-800);
    margin-bottom: 0.25rem;
  }

  .day-popup-event-time {
    font-size: 0.85rem;
    color: var(--gray-600);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .day-popup-event-time .material-icons {
    font-size: 1rem;
  }

  .day-popup-empty {
    text-align: center;
    padding: 2rem;
    color: var(--gray-500);
  }

  /* ==========================================
 * ๐“… CALENDAR EVENTS
 * ========================================== */
  .calendar-event {
    position: absolute;
    left: 2px;
    right: 2px;
    background: var(--primary);
    color: var(--white);
    border-radius: var(--radius-sm);
    padding: 4px 6px;
    font-size: 0.75rem;
    cursor: pointer;
    overflow: hidden;
    z-index: 1;
    transition: all var(--transition);
  }

  .calendar-event:hover {
    z-index: 10;
    transform: scale(1.02);
    box-shadow: var(--shadow-md);
  }

  .calendar-event-title {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .calendar-event-time {
    font-size: 0.65rem;
    opacity: 0.9;
  }

  .calendar-event.allday {
    position: relative;
    margin-bottom: 2px;
  }

  /* ==========================================
 * ๐”ฒ MODALS
 * ========================================== */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: var(--z-modal);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition);
    padding: 1rem;
  }

  .modal-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .modal {
    background: var(--white);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow: hidden;
    animation: modalSlide 0.3s ease;
  }

  .modal.modal-lg {
    max-width: 900px;
  }

  .modal-title-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .modal-title-wrap .material-icons {
    color: var(--primary);
    font-size: 1.5rem;
  }

  .modal .admin-tabs {
    border-bottom: 1px solid var(--gray-200);
    background: var(--gray-50);
  }

  @keyframes modalSlide {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--gray-200);
    background: var(--gray-50);
  }

  .modal-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--gray-800);
  }

  .modal-title .material-icons {
    color: var(--primary);
  }

  .modal-close {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--gray-200);
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    color: var(--gray-600);
    cursor: pointer;
    transition: all var(--transition);
  }

  .modal-close:hover {
    background: var(--gray-300);
    color: var(--gray-800);
  }

  .modal-body {
    padding: 1.5rem;
    max-height: calc(90vh - 140px);
    overflow-y: auto;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--gray-200);
    background: var(--gray-50);
  }

  /* ==========================================
 * ๐“ ADMIN PANEL
 * ========================================== */
  .admin-panel {
    margin: 1rem;
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .admin-tabs {
    display: flex;
    background: var(--gray-100);
    border-bottom: 2px solid var(--gray-200);
  }

  .admin-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background: transparent;
    border: none;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--gray-600);
    cursor: pointer;
    transition: all var(--transition);
    position: relative;
  }

  .admin-tab:hover {
    color: var(--primary);
    background: var(--white);
  }

  .admin-tab.active {
    color: var(--primary);
    background: var(--white);
  }

  .admin-tab.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--primary);
  }

  .admin-content {
    padding: 1.5rem;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .admin-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--gray-800);
  }

  /* ==========================================
 * ๐“ DATA TABLES
 * ========================================== */
  .table-container {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th,
  .data-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--gray-200);
  }

  .data-table th {
    background: var(--gray-50);
    font-weight: 600;
    color: var(--gray-700);
    font-size: 0.9rem;
  }

  .data-table tr:hover td {
    background: var(--gray-50);
  }

  .data-table .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  /* ==========================================
 * ๐“ FILE UPLOAD
 * ========================================== */
  .file-upload-zone {
    border: 2px dashed var(--gray-300);
    border-radius: var(--radius-lg);
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all var(--transition);
    background: var(--gray-50);
  }

  .file-upload-zone:hover {
    border-color: var(--primary);
    background: rgba(102, 126, 234, 0.05);
  }

  .file-upload-zone.dragover {
    border-color: var(--primary);
    background: rgba(102, 126, 234, 0.1);
  }

  .file-upload-input {
    display: none;
  }

  .file-upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .file-upload-text {
    color: var(--gray-700);
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .file-upload-hint {
    font-size: 0.85rem;
    color: var(--gray-500);
  }

  .file-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--gray-50);
    border-radius: var(--radius);
    margin-top: 1rem;
  }

  .file-preview-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: var(--radius);
  }

  .file-preview-info {
    flex: 1;
  }

  .file-preview-name {
    font-weight: 500;
    color: var(--gray-800);
    margin-bottom: 0.25rem;
  }

  .file-preview-size {
    font-size: 0.85rem;
    color: var(--gray-600);
  }

  .file-preview-remove {
    color: var(--danger);
    cursor: pointer;
    padding: 0.5rem;
  }

  .file-preview-remove:hover {
    background: rgba(245, 101, 101, 0.1);
    border-radius: var(--radius);
  }

  .upload-progress {
    margin-top: 1rem;
  }

  .upload-progress-bar {
    height: 8px;
    background: var(--gray-200);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .upload-progress-fill {
    height: 100%;
    background: var(--primary-gradient);
    border-radius: var(--radius-full);
    transition: width 0.3s ease;
  }

  .upload-progress-text {
    text-align: center;
    font-size: 0.85rem;
    color: var(--gray-600);
    margin-top: 0.5rem;
  }

  /* ==========================================
 * ๐“ EVENT DETAIL
 * ========================================== */
  .event-detail {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .event-detail-row {
    display: flex;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--gray-200);
  }

  .event-detail-row:last-child {
    border-bottom: none;
  }

  .event-detail-icon {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--gray-100);
    border-radius: var(--radius);
    color: var(--primary);
  }

  .event-detail-content {
    flex: 1;
  }

  .event-detail-label {
    font-size: 0.85rem;
    color: var(--gray-600);
    margin-bottom: 0.25rem;
  }

  .event-detail-value {
    color: var(--gray-800);
    font-weight: 500;
  }

  .event-detail-poster {
    width: 100%;
    margin-bottom: 1rem;
    text-align: center;
  }

  .event-detail-poster img {
    max-width: 100%;
    max-height: 250px;
    object-fit: contain;
    border-radius: var(--radius);
  }

  /* ==========================================
 * ๐ท๏ธ BADGES & STATUS
 * ========================================== */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: var(--radius-full);
  }

  .badge-success {
    background: rgba(72, 187, 120, 0.1);
    color: var(--success);
  }

  .badge-danger {
    background: rgba(245, 101, 101, 0.1);
    color: var(--danger);
  }

  .badge-warning {
    background: rgba(236, 201, 75, 0.1);
    color: #b7791f;
  }

  .badge-info {
    background: rgba(66, 153, 225, 0.1);
    color: var(--info);
  }

  .color-dot {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }

  /* ==========================================
 * ๐ฏ UTILITIES
 * ========================================== */
  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .mt-1 {
    margin-top: 0.5rem;
  }

  .mt-2 {
    margin-top: 1rem;
  }

  .mt-3 {
    margin-top: 1.5rem;
  }

  .mb-1 {
    margin-bottom: 0.5rem;
  }

  .mb-2 {
    margin-bottom: 1rem;
  }

  .mb-3 {
    margin-bottom: 1.5rem;
  }

  .hidden {
    display: none !important;
  }

  .flex {
    display: flex;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .gap-1 {
    gap: 0.5rem;
  }

  .gap-2 {
    gap: 1rem;
  }

  .w-full {
    width: 100%;
  }

  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--gray-500);
  }

  .empty-state-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-state-text {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  /* Skeleton Loading */
  .skeleton {
    background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: var(--radius);
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }

    100% {
      background-position: -200% 0;
    }
  }

  /* ==========================================
   * RESPONSIVE
   * ========================================== */
  @media (max-width: 1024px) {
    .calendar-layout {
      grid-template-columns: 1fr;
    }

    .calendar-sidebar {
      position: fixed;
      top: 0;
      right: -320px;
      width: 320px;
      height: 100vh;
      z-index: 1000;
      transition: right var(--transition-slow);
      border-radius: var(--radius-lg) 0 0 var(--radius-lg);
      opacity: 1;
      overflow: visible;
    }

    /* Responsive: active = visible */
    .calendar-sidebar.active {
      right: 0;
    }

    /* Override desktop collapsed behavior on mobile */
    .calendar-sidebar.collapsed {
      width: 320px;
      opacity: 1;
      overflow: visible;
    }

    .sidebar-mobile-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: all var(--transition);
    }

    .sidebar-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .calendar-header,
    .calendar-allday-row,
    .calendar-body {
      grid-template-columns: 50px repeat(7, 1fr);
    }

    .calendar-time-slot,
    .calendar-hour-slot {
      height: 50px;
    }
  }

  @media (max-width: 768px) {
    .header-container {
      flex-direction: column;
      align-items: stretch;
    }

    .header-nav {
      justify-content: center;
    }

    .calendar-toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .toolbar-nav,
    .toolbar-views,
    .toolbar-actions {
      justify-content: center;
    }

    .toolbar-title {
      min-width: auto;
      order: -1;
    }

    .month-day-cell {
      min-height: 70px;
      padding: 0.25rem;
    }

    .month-day-number {
      font-size: 0.8rem;
    }

    .month-event-item {
      font-size: 0.65rem;
      padding: 1px 4px;
    }

    .modal {
      max-width: 100%;
      max-height: 100vh;
      border-radius: 0;
    }

    .modal-body {
      max-height: calc(100vh - 140px);
    }

    .datetime-group {
      grid-template-columns: 1fr;
    }

    .admin-tabs {
      overflow-x: auto;
      flex-wrap: nowrap;
      padding-bottom: 0.5rem;
    }

    .admin-tab {
      white-space: nowrap;
    }
  }

  @media (max-width: 480px) {
    .login-card {
      padding: 1.5rem;
    }

    .btn {
      padding: 0.625rem 1.25rem;
    }

    .header-user {
      padding: 0.375rem 0.75rem;
    }

    .header-user-info {
      display: none;
    }

    .month-header-cell {
      font-size: 0.75rem;
      padding: 0.5rem 0.25rem;
    }

    .month-day-cell {
      min-height: 50px;
    }

    .month-event-list {
      display: none;
    }

    .month-day-cell.has-events::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      background: var(--primary);
      border-radius: 50%;
    }
  }

  /* ==========================================
   * SWEETALERT THEME
   * ========================================== */
  .swal2-popup {
    font-family: 'Kanit', sans-serif !important;
    border-radius: var(--radius-xl) !important;
  }

  .swal2-title {
    font-weight: 600 !important;
  }

  .swal2-confirm {
    background: var(--primary-gradient) !important;
    border-radius: var(--radius) !important;
    font-weight: 500 !important;
    padding: 0.75rem 1.5rem !important;
  }

  .swal2-cancel {
    background: var(--gray-200) !important;
    color: var(--gray-700) !important;
    border-radius: var(--radius) !important;
    font-weight: 500 !important;
    padding: 0.75rem 1.5rem !important;
  }

  .swal2-deny {
    background: var(--danger) !important;
    border-radius: var(--radius) !important;
    font-weight: 500 !important;
  }

  /* ==========================================
     FILE UPLOAD HIGHLIGHT
     ========================================== */
  .file-upload-zone.highlight {
    border-color: var(--primary);
    background: rgba(102, 126, 234, 0.1);
    border-style: solid;
    transform: scale(1.02);
  }

  /* ==========================================
     📅 FULLCALENDAR CUSTOM STYLES
     ========================================== */
  .fullcalendar-container {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    padding: 1rem;
    min-height: 600px;
  }

  .fc {
    font-family: 'Kanit', sans-serif;
  }

  /* Toolbar Styling */
  .fc .fc-toolbar-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--gray-800);
  }

  .fc .fc-button-primary {
    background: var(--primary) !important;
    border-color: var(--primary) !important;
    font-weight: 500;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  .fc .fc-button-primary:hover {
    background: var(--primary-dark) !important;
    border-color: var(--primary-dark) !important;
  }

  .fc .fc-button-primary:disabled {
    background: var(--gray-300) !important;
    border-color: var(--gray-300) !important;
  }

  .fc .fc-button-primary:not(:disabled).fc-button-active {
    background: var(--primary-dark) !important;
    border-color: var(--primary-dark) !important;
  }

  .fc .fc-button-primary:focus {
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25) !important;
  }

  /* Today Button */
  .fc .fc-today-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    border: none !important;
    font-weight: 500;
  }

  .fc .fc-today-button:disabled {
    opacity: 0.6;
  }

  /* Day Grid Header */
  .fc .fc-col-header-cell {
    background: var(--gray-50);
    padding: 0.75rem 0;
    font-weight: 600;
    color: var(--gray-700);
  }

  .fc .fc-col-header-cell-cushion {
    font-size: 0.9rem;
  }

  /* Day Grid Cells */
  .fc .fc-day-today {
    background: rgba(102, 126, 234, 0.08) !important;
  }

  .fc .fc-daygrid-day-number {
    font-weight: 500;
    padding: 8px;
    color: var(--gray-700);
    font-size: 0.95rem;
  }

  .fc .fc-day-today .fc-daygrid-day-number {
    background: var(--primary);
    color: white;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4px;
  }

  .fc .fc-daygrid-day-frame {
    min-height: 100px;
  }

  .fc .fc-daygrid-day:hover {
    background: var(--gray-50);
  }

  /* Event Bar Styling */
  .fc-h-event {
    border: none !important;
    border-radius: 4px !important;
    padding: 2px 6px;
    font-size: 0.85rem;
    font-weight: 500;
    margin: 1px 2px !important;
  }

  .fc-h-event .fc-event-title {
    font-weight: 500;
  }

  .fc-h-event .fc-event-main {
    padding: 2px 4px;
  }

  /* All Day Events */
  .fc .fc-daygrid-event {
    margin: 1px 2px;
    cursor: pointer;
  }

  .fc .fc-daygrid-event:hover {
    filter: brightness(0.9);
  }

  /* More Link Styling */
  .fc .fc-more-link {
    color: var(--primary);
    font-weight: 500;
    font-size: 0.8rem;
  }

  .fc .fc-more-link:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }

  /* Week/Day View Time Grid */
  .fc .fc-timegrid-slot-label {
    font-size: 0.85rem;
    color: var(--gray-600);
  }

  .fc .fc-timegrid-col.fc-day-today {
    background: rgba(102, 126, 234, 0.05) !important;
  }

  .fc-timegrid-event {
    border: none !important;
    border-radius: 4px !important;
    font-size: 0.85rem;
  }

  /* Cursor for draggable events */
  .fc-event {
    cursor: pointer;
    transition: transform var(--transition), box-shadow var(--transition);
  }

  .fc-event.fc-event-draggable:hover {
    box-shadow: var(--shadow);
    transform: scale(1.02);
  }

  .fc-event.fc-event-dragging {
    box-shadow: var(--shadow-lg);
    opacity: 0.9;
  }

  /* Popover (More Events) */
  .fc .fc-popover {
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    border: none;
  }

  .fc .fc-popover-header {
    background: var(--gray-100);
    padding: 0.75rem 1rem;
    font-weight: 600;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .fc .fc-popover-body {
    padding: 0.5rem;
  }

  /* Responsive - Hide text on small screens */
  @media (max-width: 768px) {
    .fc .fc-button {
      padding: 0.4rem 0.6rem;
      font-size: 0.8rem;
    }

    .fc .fc-toolbar-title {
      font-size: 1.1rem;
    }

    .fc .fc-toolbar {
      flex-direction: column;
      gap: 0.5rem;
    }

    .fc .fc-toolbar-chunk {
      margin: 0 !important;
    }
  }

  /* ==========================================
   * 📋 ALL EVENTS MODAL
   * ========================================== */
  .modal-xl {
    max-width: 900px;
    width: 95%;
  }

  .all-events-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: var(--gray-50);
    border-bottom: 1px solid var(--gray-200);
  }

  .all-events-search {
    flex: 1;
    min-width: 200px;
    position: relative;
  }

  .all-events-search .material-icons {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-500);
  }

  .all-events-search .form-input {
    padding-left: 2.75rem;
    background: var(--white);
  }

  .all-events-filter-group {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .all-events-filter-group .form-select {
    min-width: 120px;
    padding: 0.6rem 2rem 0.6rem 0.75rem;
    font-size: 0.9rem;
  }

  .all-events-list {
    min-height: 300px;
    max-height: 400px;
    overflow-y: auto;
  }

  .all-events-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid var(--gray-100);
    cursor: pointer;
    transition: all var(--transition);
  }

  .all-events-item:hover {
    background: var(--gray-50);
  }

  .all-events-item:last-child {
    border-bottom: none;
  }

  .all-events-item-color {
    width: 4px;
    height: 100%;
    min-height: 50px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .all-events-item-content {
    flex: 1;
    min-width: 0;
  }

  .all-events-item-title {
    font-weight: 600;
    font-size: 1rem;
    color: var(--gray-800);
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .all-events-item-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.85rem;
    color: var(--gray-600);
  }

  .all-events-item-meta span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .all-events-item-meta .material-icons {
    font-size: 1rem;
    color: var(--gray-500);
  }

  .all-events-item-badge {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    border-radius: var(--radius-full);
    font-weight: 500;
  }

  .all-events-item-badge.activity {
    background: rgba(102, 126, 234, 0.1);
    color: var(--primary);
  }

  .all-events-item-badge.substitute {
    background: rgba(237, 137, 54, 0.1);
    color: var(--accent);
  }

  .all-events-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .all-events-info {
    font-size: 0.9rem;
    color: var(--gray-600);
  }

  .all-events-pagination {
    display: flex;
    gap: 0.25rem;
  }

  .all-events-page-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--gray-300);
    background: var(--white);
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--gray-700);
    transition: all var(--transition);
  }

  .all-events-page-btn:hover:not(:disabled) {
    background: var(--gray-100);
    border-color: var(--primary);
    color: var(--primary);
  }

  .all-events-page-btn.active {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--white);
  }

  .all-events-page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .all-events-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: var(--gray-500);
  }

  .all-events-empty .material-icons {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .all-events-empty p {
    font-size: 1rem;
  }

  /* Sidebar All Events Button */
  .sidebar-all-events-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    color: var(--white);
    cursor: pointer;
    transition: all var(--transition);
  }

  .sidebar-all-events-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(2px);
  }

  .sidebar-all-events-btn .material-icons {
    font-size: 1.2rem;
  }

  /* Responsive All Events Modal */
  @media (max-width: 768px) {
    .all-events-filters {
      flex-direction: column;
    }

    .all-events-filter-group {
      width: 100%;
    }

    .all-events-filter-group .form-select {
      flex: 1;
    }

    .all-events-item {
      flex-direction: column;
      gap: 0.5rem;
    }

    .all-events-item-color {
      width: 100%;
      height: 4px;
      min-height: auto;
    }

    .all-events-footer {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
