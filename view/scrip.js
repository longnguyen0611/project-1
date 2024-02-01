//blog-website/view/scrip.js
$(document).ready(function () {
    // Lấy danh sách blog khi trang được tải
    fetchBlogList();

    // Hàm để lấy danh sách blog từ server và hiển thị trên trang
    function fetchBlogList() {
        $.get('/blogs', function (data) {
            const blogListContainer = $('#blog-list');
            blogListContainer.empty();

            // Duyệt qua danh sách blog và thêm vào HTML
            data.forEach(function (blog) {
                const blogPost = $('<div class="blog-post"></div>');
                blogPost.text(blog.title);
                blogPost.click(function () {
                    // Khi bấm vào tiêu đề, hiển thị nội dung
                    fetchBlogContentDisplay(blog._id);
                    fetchBlogContentEdit(blog._id);
                });
                blogListContainer.append(blogPost);
            });
        });
    }

    // Hàm để lấy nội dung của một blog từ server và hiển thị trên trang
    function fetchBlogContentDisplay(blogId) {
        $.get('/blog/' + blogId, function (data) {
            const blogContentContainer = $('#blog-content');
            blogContentContainer.empty();

            // Hiển thị tiêu đề và nội dung blog
            const titleElement = $('<h2></h2>').text(data.title);
            const contentElement = $('<p></p>').text(data.content);

            blogContentContainer.append(titleElement, contentElement);
        });
    }
    //hàm để sửa blog
    function fetchBlogContentEdit(blogId) {
        $.get('/blog/' + blogId, function (data) {
            const blogContentContainer = $('#blog-content');
            blogContentContainer.empty();
    
            const titleElement = $('<h2></h2>').text(data.title);
            const contentElement = $('<p></p>').text(data.content);
    
            const editButton = $('<button>Sửa</button>').click(function () {
                // Hiển thị form sửa blog
                displayEditForm(data._id, data.title, data.content);
            });
    
            const deleteButton = $('<button>Xóa</button>').click(function () {
                // Xác nhận xóa và gửi yêu cầu xóa blog
                const confirmDelete = confirm('Bạn có chắc chắn muốn xóa blog này?');
                if (confirmDelete) {
                    deleteBlog(data._id);
                }
            });
    
            blogContentContainer.append(titleElement, contentElement, editButton, deleteButton);
        });
    }
    //hàm để xóa blog
    function deleteBlog(blogId) {
        $.ajax({
            url: '/delete-blog/' + blogId,
            type: 'DELETE',
            success: function (data) {
                console.log('Blog đã bị xóa:', data);
                // Cập nhật danh sách blog sau khi xóa
                fetchBlogList();
                // Xóa nội dung blog hiện tại
                $('#blog-content').empty();
            },
            error: function (error) {
                console.error('Lỗi khi xóa blog:', error);
            },
        });
    }
    function displayEditForm(blogId, title, content) {
        // Hiển thị form sửa
        $('#edit-form').show();
        // Đặt giá trị của form thành thông tin blog hiện tại
        $('#edit-title').val(title);
        $('#edit-content').val(content);
    
        // Xử lý sự kiện khi form sửa được gửi
        $('#edit-blog-form').submit(function (event) {
            event.preventDefault();
            const editedTitle = $('#edit-title').val();
            const editedContent = $('#edit-content').val();
    
            // Gửi yêu cầu sửa blog
            editBlog(blogId, editedTitle, editedContent);
        });
    }
    function editBlog(blogId, editedTitle, editedContent) {
        $.ajax({
            url: '/edit-blog/' + blogId,
            type: 'PUT',
            data: {
                title: editedTitle,
                content: editedContent,
            },
            success: function (data) {
                console.log('Blog đã được sửa:', data);
                // Cập nhật danh sách blog sau khi sửa
                fetchBlogList();
                // Cập nhật nội dung blog hiện tại
                fetchBlogContentDisplay(blogId);
                // Ẩn form sửa
                $('#edit-form').hide();
            },
            error: function (error) {
                console.error('Lỗi khi sửa blog:', error);
            },
        });
    }
});

