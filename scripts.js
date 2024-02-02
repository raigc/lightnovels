// Function to add a novel
function addNovel() {
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for a novel';
    searchInput.addEventListener('input', searchNovelOptions);

    // Create options list
    const novelOptionsList = document.createElement('ul');
    novelOptionsList.className = 'novel-options';

    // Append search input and options list to the container
    const container = document.getElementById('addNovelContainer');
    container.appendChild(searchInput);
    container.appendChild(novelOptionsList);

    // Hide the search input and options when an option is selected
    function hideSearchOptions() {
        container.removeChild(searchInput);
        container.removeChild(novelOptionsList);
        document.removeEventListener('click', hideSearchOptions);
    }

    // Function to search and display novel options
    function searchNovelOptions() {
        const searchTerm = searchInput.value.toLowerCase();

        // Make a GET request to fetch all novels
        fetch('http://127.0.0.1:8000/all_light_novels')
            .then(response => response.json())
            .then(data => {
                const filteredNovels = data.filter(novel =>
                    novel.title.toLowerCase().includes(searchTerm)
                );

                // Clear previous options
                novelOptionsList.innerHTML = '';

                // Display filtered options
                filteredNovels.forEach(novel => {
                    const optionItem = document.createElement('li');
                    optionItem.textContent = novel.title;
                    optionItem.addEventListener('click', () => {
                        selectNovel(novel);
                        hideSearchOptions(); // Hide options when a selection is made
                    });
                    novelOptionsList.appendChild(optionItem);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Function to handle the selection of a novel
    function selectNovel(selectedNovel) {
        // Make a POST request to add the selected novel
        fetch('http://127.0.0.1:8000/light_novels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": selectedNovel.id,
                "title": selectedNovel.title,
                "author": selectedNovel.author,
                "status": selectedNovel.status,
                "progress": selectedNovel.progress,
                "latest_release": selectedNovel.latest_release,
                // You can leave other fields empty for now or prompt the user for additional information
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Add the new novel to the list
            const novelList = document.getElementById('novelList');
            const novelItem = document.createElement('li');
            novelItem.className = 'novelItem';
            novelItem.textContent = `${data.title} by ${data.author} - Status: ${data.status}, Progress: ${data.progress}, Latest Release: ${data.latest_release}`;

            // Add buttons for update and delete with the novel's id
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.onclick = () => updateNovel(data.id);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteNovel(data.id);

            novelItem.appendChild(updateButton);
            novelItem.appendChild(deleteButton);

            novelList.appendChild(novelItem);
        })
        .catch(error => console.error('Error:', error));
    }

    // Add an event listener to close the search options if clicked outside
    // document.addEventListener('click', hideSearchOptions);
}



// Function to update a novel
function updateNovel(id) {
    const title = prompt('Enter new title:');
    if(title === null){
        return console.log("update canceled")
    }
    const author = prompt('Enter new author:');
    if(author === null){
        return console.log("update canceled")
    }
    const status = prompt('Enter new status:');
    if(status === null){
        return console.log("update canceled")
    }
    const progress = prompt('Enter new progress:');
    if(progress === null){
        return console.log("update canceled")
    }
    const latestRelease = prompt('Enter new latest release:');
    if(latestRelease === null){
        return console.log("update canceled")
    }


    // Make a PUT request to update a novel
    fetch(`http://127.0.0.1:8000/light_novels/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
            title: title,
            author: author,
            status: status,
            progress: progress,
            latest_release: latestRelease,
        }),
    })
    .then(response => response.json())
    .then(data => {
        // Update the novel in the list
        fetchNovels();
    })
    .catch(error => console.error('Error:', error));

}

// Function to delete a novel
function deleteNovel(id) {
    // Make a DELETE request to delete a novel
    fetch(`http://127.0.0.1:8000/light_novels/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        // Remove the novel from the list
        fetchNovels();
    })
    .catch(error => console.error('Error:', error));
}

// Function to fetch and display novels
function fetchNovels() {
    // Make a GET request to fetch all novels
    fetch('http://127.0.0.1:8000/light_novels')
    .then(response => response.json())
    .then(data => {
        // Display the novels in the list
        const novelList = document.getElementById('novelList');
        novelList.innerHTML = ''; // Clear existing list

        data.forEach(novel => {
            const novelItem = document.createElement('li');
            novelItem.className = 'novelItem';
            novelItem.textContent = `${novel.title} by ${novel.author} - Status: ${novel.status}, Progress: ${novel.progress}, Latest Release: ${novel.latest_release}`;

            // Add buttons for update and delete with the novel's id
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.onclick = () => updateNovel(novel.id);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteNovel(novel.id);

            novelItem.appendChild(updateButton);
            novelItem.appendChild(deleteButton);

            novelList.appendChild(novelItem);
        });
    })
    .catch(error => console.error('Error:', error));
}

function searchNovels() {
  var input, filter, div, li, a, i, txtValue;
  input = document.querySelector("#searchInput");
  filter = input.value.toUpperCase();
  div = document.querySelector("#novelList");
  li = div.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i];//.getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}



// Fetch novels when the page loads
fetchNovels();
