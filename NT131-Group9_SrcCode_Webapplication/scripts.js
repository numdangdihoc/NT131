
document.addEventListener('DOMContentLoaded', function () {
    const linkElement_sum = document.querySelector('.sum');
    const linkElement_tmp = document.querySelector('.temp_humi');
    const linkElement_CO = document.querySelector('.CO');
    const linkElement_Dust = document.querySelector('.dust');
  
    const chartDiv = document.querySelector('.chart_tmp');
    const chartDiv_CO = document.getElementById("chartMQ7");
    const chartDiv_dust = document.getElementById("chartDust");
    const table_ = document.querySelector('.minmax_display');

    linkElement_tmp.addEventListener('click', function (event) {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
      chartDiv.style.display = 'none';
      
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
      if (chartDiv_dust.style.display === 'none') {
        chartDiv_dust.style.display = 'block';
        chartDiv.style.display = chartDiv_CO.style.display = table_.style.display = 'none';
      } else {
        chartDiv_dust.style.display = 'none';
      }
  
    });
  
    linkElement_sum.addEventListener('click', function (event) {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
      chartDiv.style.marginLeft = null;
      chartDiv.style.display = 'flex';
      chartDiv_CO.style.display = chartDiv_dust.style.display = 'block';
      table_.style.display = 'block';
    });
  
  });
  
