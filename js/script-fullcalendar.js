<script>
    // ==========================================
    // 📅 FULLCALENDAR INTEGRATION
    // ==========================================

    /**
     * Initialize FullCalendar
     * Call this after loading app data
     */
    function initFullCalendar() {
        const calendarEl = document.getElementById('fullCalendar');
        if (!calendarEl) {
            console.error('FullCalendar container not found');
            return;
        }

        // Determine initial view based on settings
        let initialView = 'dayGridMonth';
        if (APP_STATE.settings.DefaultView === 'week') {
            initialView = 'timeGridWeek';
        } else if (APP_STATE.settings.DefaultView === 'day') {
            initialView = 'timeGridDay';
        }

        APP_STATE.fullCalendar = new FullCalendar.Calendar(calendarEl, {
            // Basic Settings
            initialView: initialView,
            locale: 'th',
            timeZone: 'Asia/Bangkok',

            // Thai Buddhist Year Title Format
            titleFormat: function (info) {
                const date = info.date.marker;
                const month = THAI_MONTHS[date.getMonth()];
                const year = date.getFullYear() + 543;
                return month + ' ' + year;
            },

            // Header Toolbar
            headerToolbar: {
                left: 'prev,today,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            buttonText: {
                today: 'วันนี้',
                month: 'เดือน',
                week: 'สัปดาห์',
                day: 'วัน'
            },

            // Display Settings
            dayMaxEvents: 3,
            eventDisplay: 'block',
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            },

            // Drag & Drop (only for logged-in users)
            editable: !APP_STATE.isPublicView,
            eventDrop: handleFCEventDrop,
            eventResize: handleFCEventResize,

            // Event Source - fetch on demand
            events: fetchEventsForFullCalendar,

            // Event Handlers
            eventClick: function (info) {
                showEventDetail(info.event.id);
            },
            dateClick: function (info) {
                if (!APP_STATE.isPublicView) {
                    showEventModal(null, info.dateStr, info.dateStr);
                }
            },

            // View Change Handler
            datesSet: function (info) {
                APP_STATE.currentDate = info.view.currentStart;
                const viewType = info.view.type;
                APP_STATE.currentView = viewType.includes('Month') ? 'month' :
                    viewType.includes('Week') ? 'week' : 'day';
            }
        });

        APP_STATE.fullCalendar.render();
    }

    /**
     * Fetch events for FullCalendar in the required format
     */
    function fetchEventsForFullCalendar(info, successCallback, failureCallback) {
        const fetchFunc = APP_STATE.isPublicView ? 'getPublicEvents' : 'getEvents';

        google.script.run
            .withSuccessHandler(res => {
                const result = JSON.parse(res);
                if (result.success) {
                    APP_STATE.events = result.data || [];

                    // Apply category filter
                    let filteredEvents = APP_STATE.events;
                    if (APP_STATE.currentFilter && APP_STATE.currentFilter !== 'all') {
                        filteredEvents = APP_STATE.events.filter(e => e.category === APP_STATE.currentFilter);
                    }

                    const fcEvents = filteredEvents.map(e => mapEventToFullCalendar(e));
                    successCallback(fcEvents);
                    renderSidebarEvents(); // Update sidebar as well
                } else {
                    successCallback([]);
                }
                hideLoader();
            })
            .withFailureHandler(err => {
                console.error('Failed to fetch events:', err);
                failureCallback(err);
                hideLoader();
            })
        [fetchFunc](info.startStr, info.endStr);
    }

    /**
     * Map app event format to FullCalendar event format
     */
    function mapEventToFullCalendar(event) {
        const isAllDay = event.allDay === true || event.allDay === 'TRUE';
        let start = event.startDate;
        let end = event.endDate;

        // Handle timed events
        if (!isAllDay && event.startTime && event.startTime.includes(':')) {
            start = event.startDate + 'T' + event.startTime;
            if (event.endTime && event.endTime.includes(':')) {
                end = event.endDate + 'T' + event.endTime;
            } else {
                end = event.endDate + 'T' + event.startTime;
            }
        } else {
            // FullCalendar uses exclusive end date for all-day events
            // Add 1 day to end date
            const endDate = new Date(event.endDate);
            endDate.setDate(endDate.getDate() + 1);
            end = formatDateISO(endDate);
        }

        return {
            id: event.eventId,
            title: event.title,
            start: start,
            end: end,
            allDay: isAllDay,
            backgroundColor: event.color || '#667eea',
            borderColor: event.color || '#667eea',
            extendedProps: {
                description: event.description,
                category: event.category || 'activity',
                location: event.location,
                departmentId: event.departmentId,
                posterFileId: event.posterFileId,
                posterFileName: event.posterFileName
            }
        };
    }

    /**
     * Handle event drop (Drag & Drop)
     */
    function handleFCEventDrop(info) {
        const event = info.event;
        const newStart = formatDateISO(event.start);
        // For all-day events, subtract 1 day from end (exclusive -> inclusive)
        let newEnd = newStart;
        if (event.end) {
            const endDate = new Date(event.end);
            if (event.allDay) {
                endDate.setDate(endDate.getDate() - 1);
            }
            newEnd = formatDateISO(endDate);
        }

        Swal.fire({
            title: 'ย้ายกิจกรรม?',
            text: 'ย้าย "' + event.title + '" ไปวันที่ ' + formatThaiDate(event.start) + '?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ย้าย',
            cancelButtonText: 'ยกเลิก'
        }).then(result => {
            if (result.isConfirmed) {
                updateEventDatesFC(event.id, newStart, newEnd);
            } else {
                info.revert();
            }
        });
    }

    /**
     * Handle event resize
     */
    function handleFCEventResize(info) {
        const event = info.event;
        const newStart = formatDateISO(event.start);
        let newEnd = newStart;
        if (event.end) {
            const endDate = new Date(event.end);
            if (event.allDay) {
                endDate.setDate(endDate.getDate() - 1);
            }
            newEnd = formatDateISO(endDate);
        }

        updateEventDatesFC(event.id, newStart, newEnd);
    }

    /**
     * Update event dates via backend
     */
    function updateEventDatesFC(eventId, newStartDate, newEndDate) {
        showLoader('กำลังบันทึก...');
        google.script.run
            .withSuccessHandler(res => {
                const result = JSON.parse(res);
                if (result.success) {
                    showAlert('success', 'อัปเดตวันที่สำเร็จ');
                } else {
                    showAlert('error', result.message);
                    // Refetch to revert UI
                    if (APP_STATE.fullCalendar) {
                        APP_STATE.fullCalendar.refetchEvents();
                    }
                }
                hideLoader();
            })
            .withFailureHandler(err => {
                showAlert('error', 'เกิดข้อผิดพลาด');
                if (APP_STATE.fullCalendar) {
                    APP_STATE.fullCalendar.refetchEvents();
                }
                hideLoader();
            })
            .updateEventDates(eventId, newStartDate, newEndDate);
    }

    /**
     * Refresh FullCalendar events
     */
    function refreshFullCalendar() {
        if (APP_STATE.fullCalendar) {
            APP_STATE.fullCalendar.refetchEvents();
        }
    }
</script>
