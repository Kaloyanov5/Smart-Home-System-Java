document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('apartments').style.display = 'block';
    document.getElementById('apartment-details').style.display = 'none';

    loadApartments();

    document.getElementById('createApartment').addEventListener('click', () => {
        const name = prompt('Enter apartment name:');
        if (!name || name.trim() === '') return;

        fetch('/api/apartments')
            .then(response => response.json())
            .then(apartments => {
                const duplicate = apartments.find(apartment => apartment.name === name);
                if (duplicate) {
                    alert('An apartment with this name already exists!');
                    return;
                }

                fetch('/api/apartments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                }).then(() => location.reload());
            });
    });

    document.getElementById('goBack').addEventListener('click', goBack);
    document.getElementById('createRoom').addEventListener('click', createRoom);
});

function loadApartments() {
    fetch('http://localhost:8080/api/apartments')
        .then(response => response.json())
        .then(apartments => {
            const apartmentListDiv = document.getElementById('apartment-list');
            apartmentListDiv.innerHTML = apartments.map(apartment => `
                <div>
                    <h2>${apartment.name}</h2>
                    <button onclick="openApartment(${apartment.id})">Open</button>
                    <button onclick="deleteApartment(${apartment.id})">Delete</button>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error fetching apartments:', error));
}

function openApartment(id) {
    document.getElementById('apartments').style.display = 'none';
    document.getElementById('apartment-details').style.display = 'block';

    fetch(`/api/rooms/apartment/${id}`)
        .then(response => response.json())
        .then(rooms => {
            const roomsDiv = document.getElementById('rooms');
            roomsDiv.innerHTML = rooms.map(room => `
                <div>
                    <h3>${room.name}</h3>
                    <button onclick="createAppliance(${room.id})">Create Appliance</button>
                    <button onclick="deleteRoom(${room.id})">Delete Room</button>
                    <div id="appliances-${room.id}">
                        ${room.appliances.map(appliance => `
                            <div>
                                <span>${appliance.name}: ${appliance.isOn ? 'ON' : 'OFF'}</span>
                                <button onclick="toggleAppliance(${appliance.id})">
                                    Turn ${appliance.isOn ? 'OFF' : 'ON'}
                                </button>
                                <!-- <button onclick="deleteAppliance(${appliance.id}, ${room.id})">Delete Appliance</button> -->
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error("Error fetching rooms:", error);
            alert("Could not load rooms. Please try again.");
        });

    window.currentApartmentId = id;
}

function deleteApartment(id) {
    if (!confirm('Are you sure you want to delete this apartment?')) return;

    fetch(`/api/apartments/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete apartment');
            alert('Apartment deleted successfully!');
            loadApartments();
        })
        .catch(error => {
            console.error('Error deleting apartment:', error);
            alert('Could not delete apartment.');
        });
}

function loadAppliances(roomId) {
    fetch(`/api/appliances/room/${roomId}`)
        .then(response => response.json())
        .then(appliances => {
            const appliancesDiv = document.getElementById(`appliances-${roomId}`);
            appliancesDiv.innerHTML = appliances.map(appliance => `
                <div>
                    <span>${appliance.name}: ${appliance.isOn ? 'ON' : 'OFF'}</span>
                    <button onclick="toggleAppliance(${appliance.id})">
                        Turn ${appliance.isOn ? 'OFF' : 'ON'}
                    </button>
                    <!-- <button onclick="deleteAppliance(${appliance.id}, ${roomId})">Delete Appliance</button> -->
                </div>
            `).join('');
        })
        .catch(error => {
            console.error("Error loading appliances:", error);
            alert("Could not load appliances. Please try again.");
        });
}

function createRoom() {
    const roomName = prompt('Enter room name:');
    if (!roomName || !window.currentApartmentId || roomName.trim() === '') return;

    fetch(`/api/rooms?apartmentId=${window.currentApartmentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roomName })
    })
        .then(response => response.json())
        .then(data => {
            alert('Room created successfully!');
            openApartment(window.currentApartmentId);
        })
        .catch(error => {
            console.error('Error creating room:', error);
            alert('Could not create room. Please try again.');
        });
}

function deleteRoom(id) {
    if (!confirm('Are you sure you want to delete this room?')) return;

    fetch(`/api/rooms/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete room');
            alert('Room deleted successfully!');
            openApartment(window.currentApartmentId);
        })
        .catch(error => {
            console.error('Error deleting room:', error);
            alert('Could not delete room.');
        });
}

function toggleAppliance(applianceId) {
    fetch(`/api/appliances/${applianceId}/toggle`, { method: 'PATCH' })
        .then(response => response.json())
        .then(() => {
            alert('Appliance toggled successfully!');
            openApartment(window.currentApartmentId);
        })
        .catch(error => {
            console.error("Error toggling appliance:", error);
            alert("Could not toggle appliance. Please try again.");
        });
}

function createAppliance(roomId) {
    const name = prompt('Enter appliance name:');
    if (!name || name.trim() === '') return;

    fetch(`/api/appliances?roomId=${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    })
        .then(response => response.json())
        .then(() => {
            alert('Appliance created successfully!');
            loadAppliances(roomId);
        })
        .catch(error => {
            console.error("Error creating appliance:", error);
            alert("Could not create appliance.");
        });
}

function deleteAppliance(applianceId, roomId) {
    if (!confirm('Are you sure you want to delete this appliance?')) return;

    fetch(`/api/appliances/${applianceId}`, { method: 'DELETE' })
        .then(response => {
            if (response.status === 204) {
                alert('Appliance deleted successfully!');
                loadAppliances(roomId); // Refresh the appliances in the room
            } else {
                return response.json().then(error => {
                    throw new Error(error.message || 'Failed to delete appliance');
                });
            }
        })
        .catch(error => {
            console.error('Error deleting appliance:', error);
            alert('Could not delete appliance. Please try again.');
        });
}

function goBack() {
    document.getElementById('apartment-details').style.display = 'none';
    document.getElementById('apartments').style.display = 'block';
}
