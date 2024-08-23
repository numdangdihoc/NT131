
document.addEventListener('DOMContentLoaded', function () {
    const linkElement_sum = document.querySelector('.sum');
    const linkElement_tmp = document.querySelector('.temp_humi');
    const linkElement_CO = document.querySelector('.CO');
    const linkElement_Dust = document.querySelector('.dust');
  
    const chartDiv = document.querySelector('.chart_tmp');
    const chartDiv_CO = document.getElementById("chartMQ7");
    const chartDiv_dust = document.getElementById("chartDust");
    const table_ = document.querySelector('.minmax_display');

    const loginContainer = document.querySelector('.login-container');
    linkElement_tmp.addEventListener('click', function (event) {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
      chartDiv.style.display = 'none';
      loginContainer.style.display = 'none';
      if (chartDiv.style.display === 'none') {
        chartDiv.style.display = 'block';
        chartDiv.style.marginLeft = '200px';
        
        chartDiv_CO.style.display = chartDiv_dust.style.display = table_.style.display= 'none';
      } else {
        chartDiv.style.display = 'none';
        chartDiv.style.marginLeft = null;
        
      }
    });
    linkElement_CO.addEventListener('click', function (event) {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
      chartDiv_CO.style.display = 'none';
      loginContainer.style.display = 'none';
      if (chartDiv_CO.style.display === 'none') {
        chartDiv_CO.style.display = 'block';
        chartDiv.style.display = chartDiv_dust.style.display =  table_.style.display= 'none';
      } else {
        chartDiv_CO.style.display = 'none';
      }
  
    });
  
    linkElement_Dust.addEventListener('click', function (event) {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
      chartDiv_dust.style.display = 'none';
      loginContainer.style.display = 'none';
      if (chartDiv_dust.style.display === 'none') {
        chartDiv_dust.style.display = 'block';
        chartDiv.style.display = chartDiv_CO.style.display = table_.style.display = 'none';
      } else {
        chartDiv_dust.style.display = 'none';
      }
  
    });
  
    linkElement_sum.addEventListener('click', function (event) {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
      loginContainer.style.display = 'none';
      chartDiv.style.marginLeft = null;
      chartDiv.style.display = 'flex';
      chartDiv_CO.style.display = chartDiv_dust.style.display = 'block';
      table_.style.display = 'block';
    });
  
  });
  

  document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageElement = document.getElementById('message');
    const loginContainer = document.querySelector('.login-container');
    
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const formData = new FormData(loginForm);
      const data = {
        username: formData.get('username'),
        password: formData.get('password')
      };
  
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        if (result.message === 'Login successful!') {
          loginContainer.style.display = 'none';
          messageElement.innerText = 'Đã đăng nhập thành công!';
          alert("đăng nhập thành công!!");
          location.reload();
          messageElement.style.color = 'green';

        } else {
          messageElement.innerText = 'Đăng nhập thất bại. Vui lòng thử lại.';
          messageElement.style.color = 'red';
          location.reload();
        }
      })
      .catch(error => {
        console.error('Error:', error);
        messageElement.innerText = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
        messageElement.style.color = 'red';
      });
    });
  });


  document.addEventListener('DOMContentLoaded', function() {
    const login_show = document.querySelector(".dropdown");
    const login_show_name = document.querySelector(".welcomeUsername");
    const loginContainer = document.querySelector('.login-container');
    // Gửi yêu cầu GET đến API '/api/user_info'
    fetch('/api/user_info')
      .then(response => {
        // Kiểm tra phản hồi từ server
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Chuyển đổi phản hồi sang dạng JSON
        return response.json();
      })
      .then(data => {
        // Kiểm tra nếu phản hồi có thông báo "Not authenticated"
        if (data.message === "Not authenticated") {
          // Thực hiện công việc a
          login_show.style.visibility = 'hidden';
          login_show_name.style.visibility = 'hidden';
          console.log("Not authenticated");

          // Ví dụ: Hiển thị thông báo lỗi lên trang web
          const errorMessageElement = document.getElementById('error-message');
          errorMessageElement.textContent = "Not authenticated";
        } else {
          // Thực hiện công việc b
          const usr_name = document.getElementById("username-login");
          console.log("Authenticated");
          loginContainer.style.display = 'none';
          // Ví dụ: Hiển thị thông tin người dùng lên trang web
          /*const userInfoElement = document.getElementById('user-info');
          userInfoElement.innerHTML = `User ID: ${data.userId}, Username: ${data.username}`; */
          usr_name.innerText = data.username;
        }
      })
      .catch(error => {
        // Xử lý lỗi nếu có
        console.error('There was a problem with the fetch operation:', error);
      });
  });



  document.addEventListener('DOMContentLoaded', function() {
    // Lắng nghe sự kiện click vào nút "Đăng xuất"
    const logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener('click', function(event) {
      
      event.preventDefault();
      
      // Gọi API để logout
      fetch('/api/logout')
        .then(response => {
          if (response.ok) {
            alert("Đăng xuất thành công!!");
            location.reload();
          } else {
            console.error('Logout failed');
          }
        })
        .catch(error => console.error('Error:', error));
    });
  });
  