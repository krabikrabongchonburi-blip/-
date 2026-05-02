<script>
    /**
     * ==========================================
     * Event Calendar - Client Script
     * V8 Runtime Compatible
     * ==========================================
     */

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    const APP_STATE = {
        currentView: 'month',
        currentDate: new Date(),
        events: [],
        departments: [],
        users: [],
        settings: {},
        user: null,
        currentEventId: null,
        isLoading: false,
        isPublicView: true,
        currentFilter: 'all',
        pendingUpload: null,
        fullCalendar: null
    };

    const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const THAI_DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

    // ==========================================
    // INITIALIZATION
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        checkSession();
        initColorPickers();
        initDragDropUpload();
    });

    function checkSession() {
        showLoader('กำลังตรวจสอบสิทธิ์');
        google.script.run
            .withSuccessHandler(res => {
                const result = JSON.parse(res);
                if (result.success && result.data) {
                    APP_STATE.user = result.data;
                    APP_STATE.isPublicView = false;
                    showAppLoggedIn();
                } else {
                    showAppPublic();
                }
                hideLoader();
            })
            .withFailureHandler(err => {
                showAppPublic();
                hideLoader();
            })
            .getCurrentUser();
    }

    function showLoginModal() {
        document.getElementById('loginModal').classList.add('active');
    }

    function closeLoginModal() {
        document.getElementById('loginModal').classList.remove('active');
    }

    function showAppPublic() {
        APP_STATE.isPublicView = true;
        document.getElementById('loggedInNav').classList.add('hidden');
        document.getElementById('btnPublicLogin').classList.remove('hidden');
        document.getElementById('loggedInActions').classList.add('hidden');
        loadPublicData();
    }

    function showAppLoggedIn() {
        APP_STATE.isPublicView = false;
        document.getElementById('loginModal').classList.remove('active');
        document.getElementById('loggedInNav').classList.remove('hidden');
        document.getElementById('btnPublicLogin').classList.add('hidden');
        document.getElementById('loggedInActions').classList.remove('hidden');
        updateUserInfo();
        loadAppData();
    }

    function updateUserInfo() {
        const user = APP_STATE.user;
        if (user) {
            document.getElementById('userName').textContent = user.displayName;
            document.getElementById('userRole').textContent = user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน';
            document.getElementById('userAvatar').textContent = user.displayName.charAt(0).toUpperCase();

            // Show/hide admin button based on role
            const btnAdmin = document.getElementById('btnAdmin');
            if (user.role === 'admin') {
                btnAdmin.classList.remove('hidden');
            } else {
                btnAdmin.classList.add('hidden');
            }
        }
    }

    function loadPublicData() {
        showLoader('กำลังโหลดข้อมูล');
        Promise.all([
            new Promise(resolve => {
                google.script.run.withSuccessHandler(res => {
                    const result = JSON.parse(res);
                    if (result.success) APP_STATE.departments = result.data || [];
                    resolve();
                }).withFailureHandler(() => resolve()).getPublicDepartments();
            }),
            new Promise(resolve => {
                google.script.run.withSuccessHandler(res => {
                    const result = JSON.parse(res);
                    if (result.success) APP_STATE.settings = result.data || {};
                    resolve();
                }).withFailureHandler(() => resolve()).getPublicSettings();
            })
        ]).then(() => {
            applySettings();
            initFullCalendar();
            hideLoader();
        });
    }

    function loadAppData() {
        showLoader('กำลังโหลดข้อมูล');
        Promise.all([
            new Promise(resolve => {
                google.script.run.withSuccessHandler(res => {
                    const result = JSON.parse(res);
                    if (result.success) APP_STATE.departments = result.data || [];
                    resolve();
                }).withFailureHandler(() => resolve()).getDepartments();
            }),
            new Promise(resolve => {
                google.script.run.withSuccessHandler(res => {
                    const result = JSON.parse(res);
                    if (result.success) APP_STATE.settings = result.data || {};
                    resolve();
                }).withFailureHandler(() => resolve()).getSettings();
            })
        ]).then(() => {
            applySettings();
            populateDepartmentDropdowns();
            initFullCalendar();
            hideLoader();
        });
    }

    function applySettings() {
        if (APP_STATE.settings.SchoolName) {
            document.getElementById('headerSchoolName').textContent = APP_STATE.settings.SchoolName;
        }
        if (APP_STATE.settings.DefaultView) {
            APP_STATE.currentView = APP_STATE.settings.DefaultView;
        }
    }

    // ==========================================
    // AUTHENTICATION
    // ==========================================
    function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            showAlert('error', 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
            return;
        }

        showLoader('กำลังเข้าสู่ระบบ');
        google.script.run
            .withSuccessHandler(res => {
                const result = JSON.parse(res);
                if (result.success) {
                    APP_STATE.user = result.data;
                    showAlert('success', result.message);
                    showAppLoggedIn();
                } else {
                    showAlert('error', result.message);
                }
                hideLoader();
            })
            .withFailureHandler(err => {
                showAlert('error', 'เกิดข้อผิดพลาด');
                hideLoader();
            })
            .login(username, password);
    }

    function handleLogout() {
        Swal.fire({
            title: 'ออกจากระบบ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ออกจากระบบ',
            cancelButtonText: 'ยกเลิก'
        }).then(result => {
            if (result.isConfirmed) {
                showLoader('กำลังออกจากระบบ');
                google.script.run
                    .withSuccessHandler(() => {
                        APP_STATE.user = null;
                        showAppPublic();
                        hideLoader();
                    })
                    .withFailureHandler(() => {
                        showAppPublic();
                        hideLoader();
                    })
                    .logout();
            }
        });
    }

    // ==========================================
    // CALENDAR RENDERING (Replaced by FullCalendar)
    // ==========================================
    function renderCalendar() {
        if (APP_STATE.fullCalendar) {
            APP_STATE.fullCalendar.refetchEvents();
        }
    }

    function loadEvents() {
        if (APP_STATE.fullCalendar) {
            APP_STATE.fullCalendar.refetchEvents();
        }
    }

    function getViewDateRange() {
        const d = APP_STATE.currentDate;
        const year = d.getFullYear();
        const month = d.getMonth();
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month + 2, 0);
        return { startDate, endDate };
    }

    // ==========================================
    // SIDEBAR
    // ==========================================
    function toggleSidebar() {
        const sidebar = document.getElementById('calendarSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const isMobile = window.innerWidth <= 1024;

        if (isMobile) {
            // Mobile: toggle active class to show/hide
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        } else {
            // Desktop: toggle collapsed class to hide/show
            sidebar.classList.toggle('collapsed');
        }
    }

    function filterByCategory(category) {
        APP_STATE.currentFilter = category;
        document.querySelectorAll('.sidebar-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        renderSidebarEvents();

        // Refresh FullCalendar to apply filter
        if (APP_STATE.fullCalendar) {
            APP_STATE.fullCalendar.refetchEvents();
        }
    }

    function renderSidebarEvents() {
        const container = document.getElementById('sidebarEvents');
        if (!container) return;

        // ดึงเดือน/ปีจาก FullCalendar ที่กำลังแสดงอยู่
        const currentDate = APP_STATE.fullCalendar ?
            APP_STATE.fullCalendar.getDate() : new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        let events = [...APP_STATE.events];

        // กรองกิจกรรมเฉพาะเดือนปัจจุบัน
        events = events.filter(e => {
            const startDate = new Date(e.startDate);
            const endDate = new Date(e.endDate);
            // เช็คว่ากิจกรรมมีช่วงวันที่ที่ตกอยู่ในเดือนปัจจุบันหรือไม่
            const monthStart = new Date(currentYear, currentMonth, 1);
            const monthEnd = new Date(currentYear, currentMonth + 1, 0);
            return (startDate <= monthEnd && endDate >= monthStart);
        });

        // กรองตามประเภท
        if (APP_STATE.currentFilter !== 'all') {
            events = events.filter(e => e.category === APP_STATE.currentFilter);
        }

        events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        if (events.length === 0) {
            container.innerHTML = '<div class="sidebar-empty"><span class="material-icons">event_busy</span><p>ไม่มีกิจกรรมในเดือนนี้</p></div>';
            return;
        }

        container.innerHTML = events.slice(0, 10).map(e => {
            const startDate = new Date(e.startDate);
            const day = startDate.getDate();
            const month = THAI_MONTHS[startDate.getMonth()];
            const year = startDate.getFullYear() + 543;
            const color = e.color || '#667eea';
            const categoryClass = e.category === 'substitute' ? 'substitute' : 'activity';
            const categoryLabel = e.category === 'substitute' ? 'สอนชดเชย' : 'กิจกรรม';
            const dateDisplay = day + ' ' + month + ' ' + year;

            return '<div class="sidebar-event-item ' + categoryClass + '" onclick="showEventDetail(\'' + e.eventId + '\')" style="border-left-color:' + color + '">' +
                '<div class="sidebar-event-content">' +
                '<h4 class="sidebar-event-title">' + (e.title || 'ไม่มีชื่อ') + '</h4>' +
                '<p class="sidebar-event-date-full"><span class="material-icons">calendar_today</span> ' + dateDisplay + '</p>' +
                '<span class="sidebar-event-badge ' + categoryClass + '">' + categoryLabel + '</span>' +
                '</div></div>';
        }).join('');
    }

    // ==========================================
    // EVENT MODAL
    // ==========================================
    function showEventModal(eventId = null, startDate = null, endDate = null) {
        const modal = document.getElementById('eventModal');
        const title = document.getElementById('eventModalTitle');
        document.getElementById('eventForm').reset();
        document.getElementById('eventId').value = '';
        document.getElementById('posterPreview').classList.add('hidden');
        document.getElementById('posterFileId').value = '';
        document.getElementById('posterFileName').value = '';
        APP_STATE.pendingUpload = null;

        if (eventId) {
            title.textContent = 'แก้ไขกิจกรรม';
            const event = APP_STATE.events.find(e => e.eventId === eventId);
            if (event) {
                document.getElementById('eventId').value = event.eventId;
                document.getElementById('eventTitle').value = event.title || '';
                document.getElementById('eventDescription').value = event.description || '';
                document.getElementById('eventCategory').value = event.category || 'activity';
                document.getElementById('eventStartDate').value = event.startDate || '';
                document.getElementById('eventEndDate').value = event.endDate || '';
                document.getElementById('eventStartTime').value = event.startTime || '';
                document.getElementById('eventEndTime').value = event.endTime || '';
                document.getElementById('eventDepartment').value = event.departmentId || '';
                document.getElementById('eventColor').value = event.color || '#667eea';
                document.getElementById('eventColorHex').textContent = event.color || '#667eea';
                document.getElementById('eventLocation').value = event.location || '';
                document.getElementById('eventAllDay').checked = event.allDay === true || event.allDay === 'TRUE';
                toggleAllDay();

                if (event.posterFileId) {
                    document.getElementById('posterFileId').value = event.posterFileId;
                    document.getElementById('posterFileName').value = event.posterFileName || '';
                    document.getElementById('posterPreviewName').textContent = event.posterFileName || 'รูปภาพ';
                    document.getElementById('posterPreviewImage').src = 'https://drive.google.com/thumbnail?id=' + event.posterFileId + '&sz=w200';
                    document.getElementById('posterPreview').classList.remove('hidden');
                }
            }
        } else {
            title.textContent = 'เพิ่มกิจกรรม';
            const today = startDate || formatDateISO(new Date());
            document.getElementById('eventStartDate').value = today;
            document.getElementById('eventEndDate').value = endDate || today;
        }

        modal.classList.add('active');
    }

    function closeEventModal() {
        document.getElementById('eventModal').classList.remove('active');
    }

    function toggleAllDay() {
        const allDay = document.getElementById('eventAllDay').checked;
        document.getElementById('timeInputs').style.display = allDay ? 'none' : 'grid';
    }

    function saveEvent() {
        const eventId = document.getElementById('eventId').value;
        const title = document.getElementById('eventTitle').value.trim();
        const startDate = document.getElementById('eventStartDate').value;
        const endDate = document.getElementById('eventEndDate').value;

        if (!title || !startDate || !endDate) {
            showAlert('error', 'กรุณากรอกข้อมูลที่จำเป็น');
            return;
        }

        const eventData = {
            eventId: eventId || null,
            title: title,
            description: document.getElementById('eventDescription').value,
            category: document.getElementById('eventCategory').value,
            startDate: startDate,
            endDate: endDate,
            startTime: document.getElementById('eventStartTime').value,
            endTime: document.getElementById('eventEndTime').value,
            departmentId: document.getElementById('eventDepartment').value,
            color: document.getElementById('eventColor').value,
            location: document.getElementById('eventLocation').value,
            allDay: document.getElementById('eventAllDay').checked,
            posterFileId: document.getElementById('posterFileId').value,
            posterFileName: document.getElementById('posterFileName').value
        };

        // Check if there's a pending file upload
        if (APP_STATE.pendingUpload) {
            showLoader('กำลังอัปโหลดรูปภาพ...');
            google.script.run
                .withSuccessHandler(uploadRes => {
                    const uploadResult = JSON.parse(uploadRes);
                    if (uploadResult.success) {
                        eventData.posterFileId = uploadResult.data.fileId;
                        eventData.posterFileName = uploadResult.data.fileName;
                        APP_STATE.pendingUpload = null;
                        doSaveEvent(eventData, eventId);
                    } else {
                        showAlert('error', 'อัปโหลดรูปภาพไม่สำเร็จ: ' + uploadResult.message);
                        hideLoader();
                    }
                })
                .withFailureHandler(err => {
                    showAlert('error', 'เกิดข้อผิดพลาดในการอัปโหลด');
                    hideLoader();
                })
                .uploadPoster(APP_STATE.pendingUpload.data, APP_STATE.pendingUpload.name, APP_STATE.pendingUpload.type);
        } else {
            doSaveEvent(eventData, eventId);
        }
    }

    function doSaveEvent(eventData, eventId) {
        showLoader(eventId ? 'กำลังแก้ไข' : 'กำลังบันทึก');

        const saveFunc = eventId ? 'updateEvent' : 'createEvent';
        google.script.run
            .withSuccessHandler(res => {
                const result = JSON.parse(res);
                if (result.success) {
                    showAlert('success', result.message);
                    closeEventModal();
                    refreshFullCalendar();
                } else {
                    showAlert('error', result.message);
                }
                hideLoader();
            })
            .withFailureHandler(err => {
                showAlert('error', 'เกิดข้อผิดพลาด');
                hideLoader();
            })
        [saveFunc](eventData);
    }

    // ==========================================
    // EVENT DETAIL
    // ==========================================
    function showEventDetail(eventId) {
        APP_STATE.currentEventId = eventId;
        const event = APP_STATE.events.find(e => e.eventId === eventId);
        if (!event) {
            showAlert('error', 'ไม่พบกิจกรรม');
            return;
        }

        const content = document.getElementById('eventDetailContent');
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        let dateStr = formatThaiDate(startDate);
        if (event.startDate !== event.endDate) {
            dateStr += ' - ' + formatThaiDate(endDate);
        }

        let timeStr = '';
        if (event.startTime) {
            timeStr = event.startTime;
            if (event.endTime) timeStr += ' - ' + event.endTime;
        }

        let posterHtml = '';
        if (event.posterFileId) {
            posterHtml = '<div class="event-detail-poster"><img src="https://drive.google.com/thumbnail?id=' + event.posterFileId + '&sz=w400" alt="โปสเตอร์"></div>';
        }

        // Generate time display
        let timeDisplay = 'ทั้งวัน';
        if (event.startTime) {
            timeDisplay = event.startTime;
            if (event.endTime) timeDisplay += ' - ' + event.endTime;
        }

        content.innerHTML = posterHtml +
            '<div class="event-detail-row">' +
            '<div class="event-detail-icon"><span class="material-icons">calendar_today</span></div>' +
            '<div class="event-detail-content"><div class="event-detail-label">วันที่</div><div class="event-detail-value">' + dateStr + '</div></div>' +
            '</div>' +
            '<div class="event-detail-row">' +
            '<div class="event-detail-icon"><span class="material-icons">schedule</span></div>' +
            '<div class="event-detail-content"><div class="event-detail-label">เวลา</div><div class="event-detail-value">' + timeDisplay + '</div></div>' +
            '</div>' +
            (event.location ? '<div class="event-detail-row"><div class="event-detail-icon"><span class="material-icons">place</span></div><div class="event-detail-content"><div class="event-detail-label">สถานที่</div><div class="event-detail-value">' + event.location + '</div></div></div>' : '') +
            (event.description ? '<div class="event-detail-row"><div class="event-detail-icon"><span class="material-icons">description</span></div><div class="event-detail-content"><div class="event-detail-label">รายละเอียด</div><div class="event-detail-value">' + event.description + '</div></div></div>' : '');

        // Show edit/delete buttons for logged in users
        const canEdit = !APP_STATE.isPublicView && (APP_STATE.user.role === 'admin' || APP_STATE.user.userId === event.createdBy);
        document.getElementById('btnEditEvent').classList.toggle('hidden', !canEdit);
        document.getElementById('btnDeleteEvent').classList.toggle('hidden', !canEdit);

        document.getElementById('eventDetailModal').classList.add('active');
    }

    function closeEventDetailModal() {
        document.getElementById('eventDetailModal').classList.remove('active');
    }

    function editCurrentEvent() {
        closeEventDetailModal();
        showEventModal(APP_STATE.currentEventId);
    }

    function confirmDeleteEvent() {
        Swal.fire({
            title: 'ลบกิจกรรม?',
            text: 'การลบจะไม่สามารถย้อนกลับได้',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#e74c3c'
        }).then(result => {
            if (result.isConfirmed) {
                showLoader('กำลังลบ');
                google.script.run
                    .withSuccessHandler(res => {
                        const r = JSON.parse(res);
                        if (r.success) {
                            showAlert('success', r.message);
                            closeEventDetailModal();
                            refreshFullCalendar();
                        } else {
                            showAlert('error', r.message);
                        }
                        hideLoader();
                    })
                    .withFailureHandler(err => {
                        showAlert('error', 'เกิดข้อผิดพลาด');
                        hideLoader();
                    })
                    .deleteEvent(APP_STATE.currentEventId);
            }
        });
    }

    // ==========================================
    // DAY POPUP
    // ==========================================
    function showDayPopup(date) {
        const popup = document.getElementById('dayPopup');
        const title = document.getElementById('dayPopupTitle');
        const body = document.getElementById('dayPopupBody');

        const d = new Date(date);
        title.textContent = 'กิจกรรมวันที่ ' + d.getDate() + ' ' + THAI_MONTHS[d.getMonth()].substring(0, 3);

        const dateStr = formatDateISO(d);
        const dayEvents = APP_STATE.events.filter(e => e.startDate <= dateStr && e.endDate >= dateStr);

        if (dayEvents.length === 0) {
            body.innerHTML = '<p class="text-center" style="color:var(--gray-600)">ไม่มีกิจกรรม</p>';
        } else {
            body.innerHTML = dayEvents.map(e => {
                return '<div class="day-popup-event" onclick="showEventDetail(\'' + e.eventId + '\')" style="border-left-color:' + (e.color || '#667eea') + '">' +
                    '<h4>' + (e.title || 'ไม่มีชื่อ') + '</h4>' +
                    '<p>' + (e.startTime || 'ทั้งวัน') + '</p></div>';
            }).join('');
        }

        popup.classList.add('active');
    }

    function closeDayPopup() {
        document.getElementById('dayPopup').classList.remove('active');
    }

    // ==========================================
    // ADMIN PANEL
    // ==========================================
    function toggleAdminPanel() {
        const modal = document.getElementById('adminModal');
        modal.classList.add('active');
        loadDepartments();
    }

    function closeAdminModal() {
        document.getElementById('adminModal').classList.remove('active');
    }

    function switchAdminTab(tab) {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-content').forEach(c => c.classList.add('hidden'));
        document.querySelector('.admin-tab[data-tab="' + tab + '"]').classList.add('active');
        document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.remove('hidden');

        if (tab === 'departments') loadDepartments();
        else if (tab === 'users') loadUsers();
        else if (tab === 'settings') loadSettingsForm();
    }

    // ==========================================
    // DEPARTMENTS
    // ==========================================
    function loadDepartments() {
        google.script.run
            .withSuccessHandler(res => {
                const result = JSON.parse(res);
                if (result.success) {
                    APP_STATE.departments = result.data || [];
                    renderDepartmentsTable();
                }
            })
            .getDepartments();
    }

    function renderDepartmentsTable() {
        const tbody = document.getElementById('departmentsTableBody');
        if (APP_STATE.departments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">ไม่มีข้อมูล</td></tr>';
            return;
        }
        tbody.innerHTML = APP_STATE.departments.map(d => {
            return '<tr>' +
                '<td>' + d.name + '</td>' +
                '<td><span class="color-badge" style="background:' + d.color + '"></span> ' + d.color + '</td>' +
                '<td><span class="badge badge-' + (d.isActive ? 'success' : 'secondary') + '">' + (d.isActive ? 'ใช้งาน' : 'ปิด') + '</span></td>' +
                '<td class="text-center">' +
                '<button class="btn btn-sm btn-outline" onclick="showDepartmentModal(\'' + d.departmentId + '\')" title="แก้ไข"><span class="material-icons">edit</span></button> ' +
                '<button class="btn btn-sm btn-danger" onclick="confirmDeleteDepartment(\'' + d.departmentId + '\', \'' + d.name + '\')" title="ลบ"><span class="material-icons">delete</span></button>' +
                '</td>' +
                '</tr>';
        }).join('');
    }

    function showDepartmentModal(id = null) {
        const modal = document.getElementById('departmentModal');
        const title = document.getElementById('departmentModalTitle');
        document.getElementById('departmentForm').reset();
        document.getElementById('departmentId').value = '';

        if (id) {
            title.textContent = 'แก้ไขฝ่ายงาน';
            const dept = APP_STATE.departments.find(d => d.departmentId === id);
            if (dept) {
                document.getElementById('departmentId').value = dept.departmentId;
                document.getElementById('departmentName').value = dept.name;
                document.getElementById('departmentColor').value = dept.color || '#3498db';
                document.getElementById('departmentColorHex').textContent = dept.color || '#3498db';
                document.getElementById('departmentActive').checked = dept.isActive;
            }
        } else {
            title.textContent = 'เพิ่มฝ่ายงาน';
        }

        modal.classList.add('active');
    }

    function closeDepartmentModal() {
        document.getElementById('departmentModal').classList.remove('active');
    }

    function saveDepartment() {
        const id = document.getElementById('departmentId').value;
        const name = document.getElementById('departmentName').value.trim();

        if (!name) {
            showAlert('error', 'กรุณากรอกชื่อฝ่าย');
            return;
        }

        const data = {
            departmentId: id || null,
            name: name,
            color: document.getElementById('departmentColor').value,
            isActive: document.getElementById('departmentActive').checked
        };

        showLoader('กำลังบันทึก');
        const func = id ? 'updateDepartment' : 'createDepartment';
        google.script.run
            .withSuccessHandler(res => {
                const result = JSON.parse(res);
                if (result.success) {
                    showAlert('success', result.message);
                    closeDepartmentModal();
                    loadDepartments();
                    populateDepartmentDropdowns();
                } else {
                    showAlert('error', result.message);
                }
                hideLoader();
            })
            .withFailureHandler(err => {
                showAlert('error', 'เกิดข้อผิดพลาด');
                hideLoader();
            })
        [func](data);
    }

    function confirmDeleteDepartment(departmentId, name) {
        Swal.fire({
            title: 'ลบฝ่ายงาน?',
            html: 'คุณต้องการลบฝ่าย <strong>' + name + '</strong> หรือไม่?<br><small>การลบจะไม่สามารถย้อนกลับได้</small>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#e74c3c'
        }).then(result => {
            if (result.isConfirmed) {
                showLoader('กำลังลบ');
                google.script.run
                    .withSuccessHandler(res => {
                        const r = JSON.parse(res);
                        if (r.success) {
                            showAlert('success', r.message);
                            loadDepartments();
                            populateDepartmentDropdowns();
                        } else {
                            showAlert('error', r.message);
                        }
                        hideLoader();
                    })
                    .withFailureHandler(err => {
                        showAlert('error', 'เกิดข้อผิดพลาด');
                        hideLoader();
                    })
                    .deleteDepartment(departmentId);
            }
        });
    }

    function populateDepartmentDropdowns() {
        const activeDepts = APP_STATE.departments.filter(d => d.isActive);
        const options = '<option value="">-- เลือกฝ่ายงาน --</option>' +
            activeDepts.map(d => '<option value="' + d.departmentId + '">' + d.name + '</option>').join('');

        const eventDept = document.getElementById('eventDepartment');
        const userDept = document.getElementById('userDepartment');
        if (eventDept) eventDept.innerHTML = options;
        if (userDept) userDept.innerHTML = options.replace('เลือกฝ่ายงาน', 'ไม่ระบุ');
    }

    // ==========================================
    // USERS
    // ==========================================
    function loadUsers() {
        google.script.run
            .withSuccessHandler(res => {
                const result = JSON.parse(res);
                if (result.success) {
                    APP_STATE.users = result.data || [];
                    renderUsersTable();
                }
            })
            .getUsers();
    }

    function renderUsersTable() {
        const tbody = document.getElementById('usersTableBody');
        if (APP_STATE.users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">ไม่มีข้อมูล</td></tr>';
            return;
        }
        tbody.innerHTML = APP_STATE.users.map(u => {
            const dept = APP_STATE.departments.find(d => d.departmentId === u.departmentId);
            const isCurrentUser = APP_STATE.user && APP_STATE.user.userId === u.userId;
            return '<tr>' +
                '<td>' + u.username + '</td>' +
                '<td>' + u.displayName + '</td>' +
                '<td>' + (u.role === 'admin' ? 'Admin' : 'User') + '</td>' +
                '<td>' + (dept ? dept.name : '-') + '</td>' +
                '<td><span class="badge badge-' + (u.isActive ? 'success' : 'secondary') + '">' + (u.isActive ? 'ใช้งาน' : 'ปิด') + '</span></td>' +
                '<td class="text-center">' +
                '<button class="btn btn-sm btn-outline" onclick="showUserModal(\'' + u.userId + '\')" title="แก้ไข"><span class="material-icons">edit</span></button> ' +
                (isCurrentUser ? '' : '<button class="btn btn-sm btn-danger" onclick="confirmDeleteUser(\'' + u.userId + '\', \'' + u.displayName + '\')" title="ลบ"><span class="material-icons">delete</span></button>') +
                '</td>' +
                '</tr>';
        }).join('');
    }

    function showUserModal(id = null) {
        const modal = document.getElementById('userModal');
        const title = document.getElementById('userModalTitle');
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';

        if (id) {
            title.textContent = 'แก้ไขผู้ใช้งาน';
            const user = APP_STATE.users.find(u => u.userId === id);
            if (user) {
                document.getElementById('userId').value = user.userId;
                document.getElementById('userUsername').value = user.username;
                document.getElementById('userDisplayName').value = user.displayName;
                document.getElementById('userFormRole').value = user.role;
                document.getElementById('userDepartment').value = user.departmentId || '';
                document.getElementById('userActive').checked = user.isActive;
            }
            document.getElementById('passwordLabel').textContent = 'รหัสผ่านใหม่';
        } else {
            title.textContent = 'เพิ่มผู้ใช้งาน';
            document.getElementById('passwordLabel').textContent = 'รหัสผ่าน';
        }

        modal.classList.add('active');
    }

    function closeUserModal() {
        document.getElementById('userModal').classList.remove('active');
    }

    function saveUser() {
        const id = document.getElementById('userId').value;
        const username = document.getElementById('userUsername').value.trim();
        const displayName = document.getElementById('userDisplayName').value.trim();
        const password = document.getElementById('userPassword').value;

        if (!username || !displayName) {
            showAlert('error', 'กรุณากรอกข้อมูลที่จำเป็น');
            return;
        }

        if (!id && !password) {
            showAlert('error', 'กรุณากรอกรหัสผ่าน');
            return;
        }

        const data = {
            userId: id || null,
            username: username,
            displayName: displayName,
            password: password || null,
            role: document.getElementById('userFormRole').value,
            departmentId: document.getElementById('userDepartment').value,
            isActive: document.getElementById('userActive').checked
        };

        showLoader('กำลังบันทึก');
        const func = id ? 'updateUser' : 'createUser';
        google.script.run
            .withSuccessHandler(res => {
                const result = JSON.parse(res);
                if (result.success) {
                    showAlert('success', result.message);
                    closeUserModal();
                    loadUsers();
                } else {
                    showAlert('error', result.message);
                }
                hideLoader();
            })
            .withFailureHandler(err => {
                showAlert('error', 'เกิดข้อผิดพลาด');
                hideLoader();
            })
        [func](data);
    }

    function confirmDeleteUser(userId, displayName) {
        Swal.fire({
            title: 'ลบผู้ใช้งาน?',
            html: 'คุณต้องการลบผู้ใช้ <strong>' + displayName + '</strong> หรือไม่?<br><small>การลบจะไม่สามารถย้อนกลับได้</small>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#e74c3c'
        }).then(result => {
            if (result.isConfirmed) {
                showLoader('กำลังลบ');
                google.script.run
                    .withSuccessHandler(res => {
                        const r = JSON.parse(res);
                        if (r.success) {
                            showAlert('success', r.message);
                            loadUsers();
                        } else {
                            showAlert('error', r.message);
                        }
                        hideLoader();
                    })
                    .withFailureHandler(err => {
                        showAlert('error', 'เกิดข้อผิดพลาด');
                        hideLoader();
                    })
                    .deleteUser(userId);
            }
        });
    }

    // ==========================================
    // SETTINGS
    // ==========================================
    function loadSettingsForm() {
        document.getElementById('settingSchoolName').value = APP_STATE.settings.SchoolName || '';
        document.getElementById('settingDefaultView').value = APP_STATE.settings.DefaultView || 'month';
        document.getElementById('settingDriveFolderId').value = APP_STATE.settings.DriveFolderId || '';
    }

    function saveSettings(e) {
        e.preventDefault();

        const data = {
            SchoolName: document.getElementById('settingSchoolName').value,
            DefaultView: document.getElementById('settingDefaultView').value,
            DriveFolderId: document.getElementById('settingDriveFolderId').value
        };

        showLoader('กำลังบันทึก');
        google.script.run
            .withSuccessHandler(res => {
                const result = JSON.parse(res);
                if (result.success) {
                    APP_STATE.settings = data;
                    applySettings();
                    showAlert('success', result.message);
                } else {
                    showAlert('error', result.message);
                }
                hideLoader();
            })
            .withFailureHandler(err => {
                showAlert('error', 'เกิดข้อผิดพลาด');
                hideLoader();
            })
            .saveSettings(data);
    }

    // ==========================================
    // FILE UPLOAD
    // ==========================================
    function initDragDropUpload() {
        const zone = document.getElementById('posterUploadZone');
        if (!zone) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, e => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            zone.addEventListener(eventName, () => zone.classList.add('highlight'));
        });

        ['dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, () => zone.classList.remove('highlight'));
        });

        zone.addEventListener('drop', e => {
            const files = e.dataTransfer.files;
            if (files.length) handlePosterUpload({ target: { files: files } });
        });
    }

    function handlePosterUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showAlert('error', 'กรุณาเลือกไฟล์รูปภาพ');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showAlert('error', 'ไฟล์ต้องมีขนาดไม่เกิน 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            document.getElementById('posterPreviewImage').src = event.target.result;
            document.getElementById('posterPreviewName').textContent = file.name;
            document.getElementById('posterPreviewSize').textContent = formatFileSize(file.size);
            document.getElementById('posterPreview').classList.remove('hidden');

            APP_STATE.pendingUpload = {
                data: event.target.result.split(',')[1],
                name: file.name,
                type: file.type
            };
        };
        reader.readAsDataURL(file);
    }

    function removePoster() {
        document.getElementById('posterPreview').classList.add('hidden');
        document.getElementById('posterFileId').value = '';
        document.getElementById('posterFileName').value = '';
        document.getElementById('posterInput').value = '';
        APP_STATE.pendingUpload = null;
    }

    // ==========================================
    // UTILITIES
    // ==========================================
    function showLoader(text = 'กำลังโหลด') {
        document.getElementById('loaderText').textContent = text;
        document.getElementById('loaderOverlay').classList.add('active');
        APP_STATE.isLoading = true;
    }

    function hideLoader() {
        document.getElementById('loaderOverlay').classList.remove('active');
        APP_STATE.isLoading = false;
    }

    function showAlert(type, message) {
        const icons = { success: 'success', error: 'error', warning: 'warning', info: 'info' };
        Swal.fire({
            icon: icons[type] || 'info',
            text: message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    }

    function formatDateISO(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    function formatThaiDate(date) {
        const d = new Date(date);
        const day = d.getDate();
        const month = THAI_MONTHS[d.getMonth()];
        const year = d.getFullYear() + 543;
        return day + ' ' + month + ' ' + year;
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function initColorPickers() {
        document.querySelectorAll('.color-picker').forEach(picker => {
            const hexSpan = picker.nextElementSibling;
            if (hexSpan) {
                picker.addEventListener('input', () => {
                    hexSpan.textContent = picker.value;
                });
            }
        });
    }

    // ==========================================
    // ALL EVENTS MODAL
    // ==========================================
    const ALL_EVENTS_STATE = {
        currentPage: 1,
        itemsPerPage: 10,
        filteredEvents: [],
        allEvents: []
    };

    function showAllEventsModal() {
        const modal = document.getElementById('allEventsModal');
        modal.classList.add('active');

        // Reset filters
        document.getElementById('allEventsSearch').value = '';
        document.getElementById('allEventsMonth').value = '';
        document.getElementById('allEventsYear').value = '';
        document.getElementById('allEventsCategory').value = 'all';
        ALL_EVENTS_STATE.currentPage = 1;

        // Load all events
        loadAllEventsData();
    }

    function closeAllEventsModal() {
        document.getElementById('allEventsModal').classList.remove('active');
    }

    function loadAllEventsData() {
        showLoader('กำลังโหลดกิจกรรมทั้งหมด');
        const fetchFunc = APP_STATE.isPublicView ? 'getPublicEvents' : 'getEvents';

        google.script.run
            .withSuccessHandler(res => {
                const result = JSON.parse(res);
                if (result.success) {
                    ALL_EVENTS_STATE.allEvents = result.data || [];
                    populateYearDropdown();
                    filterAllEvents();
                }
                hideLoader();
            })
            .withFailureHandler(err => {
                hideLoader();
                showAlert('error', 'ไม่สามารถโหลดข้อมูลได้');
            })
        [fetchFunc](null, null);
    }

    function populateYearDropdown() {
        const yearSelect = document.getElementById('allEventsYear');
        const years = new Set();

        ALL_EVENTS_STATE.allEvents.forEach(e => {
            const startYear = new Date(e.startDate).getFullYear();
            const endYear = new Date(e.endDate).getFullYear();
            years.add(startYear);
            years.add(endYear);
        });

        const sortedYears = Array.from(years).sort((a, b) => b - a);
        yearSelect.innerHTML = '<option value="">ทุกปี</option>' +
            sortedYears.map(y => '<option value="' + y + '">' + (y + 543) + '</option>').join('');
    }

    function filterAllEvents() {
        const searchQuery = document.getElementById('allEventsSearch').value.toLowerCase().trim();
        const filterMonth = document.getElementById('allEventsMonth').value;
        const filterYear = document.getElementById('allEventsYear').value;
        const filterCategory = document.getElementById('allEventsCategory').value;

        let events = [...ALL_EVENTS_STATE.allEvents];

        // Filter by search query
        if (searchQuery) {
            events = events.filter(e =>
                (e.title && e.title.toLowerCase().includes(searchQuery)) ||
                (e.description && e.description.toLowerCase().includes(searchQuery)) ||
                (e.location && e.location.toLowerCase().includes(searchQuery))
            );
        }

        // Filter by year
        if (filterYear) {
            const year = parseInt(filterYear);
            events = events.filter(e => {
                const startYear = new Date(e.startDate).getFullYear();
                const endYear = new Date(e.endDate).getFullYear();
                return startYear === year || endYear === year;
            });
        }

        // Filter by month
        if (filterMonth !== '') {
            const month = parseInt(filterMonth);
            events = events.filter(e => {
                const startMonth = new Date(e.startDate).getMonth();
                const endMonth = new Date(e.endDate).getMonth();
                return startMonth === month || endMonth === month;
            });
        }

        // Filter by category
        if (filterCategory !== 'all') {
            events = events.filter(e => e.category === filterCategory);
        }

        // Sort by date (newest first)
        events.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        ALL_EVENTS_STATE.filteredEvents = events;
        ALL_EVENTS_STATE.currentPage = 1;
        renderAllEventsList();
        renderAllEventsPagination();
    }

    function renderAllEventsList() {
        const container = document.getElementById('allEventsList');
        const events = ALL_EVENTS_STATE.filteredEvents;
        const page = ALL_EVENTS_STATE.currentPage;
        const perPage = ALL_EVENTS_STATE.itemsPerPage;

        const startIdx = (page - 1) * perPage;
        const endIdx = startIdx + perPage;
        const pageEvents = events.slice(startIdx, endIdx);

        if (pageEvents.length === 0) {
            container.innerHTML = '<div class="all-events-empty"><span class="material-icons">event_busy</span><p>ไม่พบกิจกรรม</p></div>';
            document.getElementById('allEventsInfo').textContent = 'แสดง 0 รายการ';
            return;
        }

        container.innerHTML = pageEvents.map(e => {
            const startDate = new Date(e.startDate);
            const endDate = new Date(e.endDate);
            const color = e.color || '#667eea';
            const categoryClass = e.category === 'substitute' ? 'substitute' : 'activity';
            const categoryLabel = e.category === 'substitute' ? 'สอนชดเชย' : 'กิจกรรม';

            let dateStr = formatThaiDate(startDate);
            if (e.startDate !== e.endDate) {
                dateStr += ' - ' + formatThaiDate(endDate);
            }

            let timeStr = 'ทั้งวัน';
            if (e.startTime) {
                timeStr = e.startTime;
                if (e.endTime) timeStr += ' - ' + e.endTime;
            }

            return '<div class="all-events-item" onclick="viewEventFromModal(\'' + e.eventId + '\')">' +
                '<div class="all-events-item-color" style="background:' + color + '"></div>' +
                '<div class="all-events-item-content">' +
                '<h4 class="all-events-item-title">' + (e.title || 'ไม่มีชื่อ') + '</h4>' +
                '<div class="all-events-item-meta">' +
                '<span><span class="material-icons">calendar_today</span>' + dateStr + '</span>' +
                '<span><span class="material-icons">schedule</span>' + timeStr + '</span>' +
                (e.location ? '<span><span class="material-icons">place</span>' + e.location + '</span>' : '') +
                '</div>' +
                '<span class="all-events-item-badge ' + categoryClass + '">' + categoryLabel + '</span>' +
                '</div></div>';
        }).join('');

        const totalShowing = Math.min(endIdx, events.length);
        document.getElementById('allEventsInfo').textContent =
            'แสดง ' + (startIdx + 1) + '-' + totalShowing + ' จาก ' + events.length + ' รายการ';
    }

    function renderAllEventsPagination() {
        const container = document.getElementById('allEventsPagination');
        const events = ALL_EVENTS_STATE.filteredEvents;
        const totalPages = Math.ceil(events.length / ALL_EVENTS_STATE.itemsPerPage);
        const currentPage = ALL_EVENTS_STATE.currentPage;

        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '';

        // Previous button
        html += '<button class="all-events-page-btn" onclick="changeAllEventsPage(' + (currentPage - 1) + ')" ' +
            (currentPage === 1 ? 'disabled' : '') + '><span class="material-icons">chevron_left</span></button>';

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            html += '<button class="all-events-page-btn" onclick="changeAllEventsPage(1)">1</button>';
            if (startPage > 2) {
                html += '<span style="padding:0 0.5rem">...</span>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            html += '<button class="all-events-page-btn ' + (i === currentPage ? 'active' : '') +
                '" onclick="changeAllEventsPage(' + i + ')">' + i + '</button>';
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += '<span style="padding:0 0.5rem">...</span>';
            }
            html += '<button class="all-events-page-btn" onclick="changeAllEventsPage(' + totalPages + ')">' + totalPages + '</button>';
        }

        // Next button
        html += '<button class="all-events-page-btn" onclick="changeAllEventsPage(' + (currentPage + 1) + ')" ' +
            (currentPage === totalPages ? 'disabled' : '') + '><span class="material-icons">chevron_right</span></button>';

        container.innerHTML = html;
    }

    function changeAllEventsPage(page) {
        const totalPages = Math.ceil(ALL_EVENTS_STATE.filteredEvents.length / ALL_EVENTS_STATE.itemsPerPage);
        if (page < 1 || page > totalPages) return;

        ALL_EVENTS_STATE.currentPage = page;
        renderAllEventsList();
        renderAllEventsPagination();

        // Scroll to top of list
        document.getElementById('allEventsList').scrollTop = 0;
    }

    function viewEventFromModal(eventId) {
        closeAllEventsModal();
        // Ensure event is in APP_STATE.events for showEventDetail
        const event = ALL_EVENTS_STATE.allEvents.find(e => e.eventId === eventId);
        if (event && !APP_STATE.events.find(e => e.eventId === eventId)) {
            APP_STATE.events.push(event);
        }
        showEventDetail(eventId);
    }
</script>
