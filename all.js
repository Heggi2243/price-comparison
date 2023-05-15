let data =[];

const getData = () =>{
    axios.get('https://hexschool.github.io/js-filter-data/data.json')
  .then(function (response) {
    data = response.data;
  })
  .catch(function (error) {
    console.log(error);
  });
}

getData();

const showList = document.querySelector('.showList');
const typeBtn = document.querySelectorAll('.btn-type');
const select = document.querySelector('#js-select');
let sortType = '';

const filterDataByType = (typeCode) => {
    filteredData = data.filter((item) => item.種類代碼 === typeCode); //顯示蔬菜、花卉或水果
    updatePage(filteredData);
    sortTable(filteredData);//傳遞資料給sortTable///
};

typeBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    sortType = 'none';
    typeBtn.forEach(otherBtn => otherBtn.classList.remove('active'));
    btn.classList.add('active');
    const typeCode = btn.getAttribute('data-type');
    filterDataByType(typeCode);//把資料帶入上面的函式，判對要顯示哪個按鈕的資料
    select[0].selected = true;
    removeHighlight();
  });
});


const removeHighlight = () => {
    const highlightedElems = document.querySelectorAll('.highlight');
    highlightedElems.forEach(elem => elem.classList.remove('highlight'));
};

const removeActive = () =>{
    const activeBtn = document.querySelectorAll('.active');
    activeBtn.forEach(elem => elem.classList.remove('active'));
};


let keyWord = '';
const txt = document.querySelector('.rounded-end');
const search = document.querySelector('.search');

const searchCrop =()=>{ //搜索作物
    if (txt.value === ''){
        alert(`請輸入作物名稱。`);
        return;
    } 
    select[0].selected = true;
    removeActive();
    keyWord = txt.value;
    const filteredData = data.filter(item => item.作物名稱 && item.作物名稱.includes(keyWord)); // 過濾符合搜尋關鍵字的作物名稱
    updatePage(filteredData); 
    
    sortType = '';
    txt.value = '';
    removeHighlight();
    sortTable(filteredData);///
};
search.addEventListener('click',searchCrop);


txt.addEventListener('keyup',(e) =>{
    if (e.keyCode === 13){
        search.click();
    }
  });


select.addEventListener('change',function(){ //選單資料

    sortType = this.options[this.selectedIndex].getAttribute('data-type');
    const typeElement = document.querySelector('.btn-type.active');     
    let typeCode = typeElement ? typeElement.getAttribute('data-type') : null; 
    let filteredData = [];

    if (typeCode) { // 如果 typeElement 存在，則根據種類代碼篩選資料
        filteredData = data.filter((item) => item.種類代碼 === typeCode); 
    } else { // 如果 typeElement 不存在，則根據關鍵字篩選資料
        if (keyWord !== '') {
            filteredData = data.filter(item => item.作物名稱 && item.作物名稱.includes(keyWord)); 
        } else {
            alert(`請先搜尋作物或點擊作物分類再進行篩選。`);
            select[0].selected = true;
        }
    }
   
    if (sortType){
        filteredData.sort((a, b) => b[sortType] - a[sortType]);
    }
    updatePage(filteredData);
});


const showResult = document.querySelector('#js-crop-name');
const updatePage = (data) => { //被帶入的資料會跑來這裡

    let str = '';
    
    if (data.length === 0){
        showList.innerHTML = `<td colspan="7" class="text-center p-3">沒有符合的結果，請選擇作物種類或重新搜索^_^</td>`;
        showResult.innerHTML = `<i class="fas fa-exclamation-triangle"></i> 找不到「${keyWord}」相關資料。`;
        return;
    }
    data.forEach((item) => {
        str += `<tr>
        <td>${item.作物名稱}</td>
        <td>${item.市場名稱}</td>
        <td>${sortType === '上價' ? `<span class="highlight">${item.上價}</span>` : item.上價}</td>
        <td>${sortType === '中價' ? `<span class="highlight">${item.中價}</span>` : item.中價}</td>
        <td>${sortType === '下價' ? `<span class="highlight">${item.下價}</span>` : item.下價}</td>
        <td>${sortType === '平均價' ? `<span class="highlight">${item.平均價}</span>` : item.平均價}</td>
        <td>${sortType === '交易量' ? `<span class="highlight">${item.交易量}</span>` : item.交易量}</td>
        </tr>`;
    });
    showList.innerHTML = str;

    const activeBtn = document.querySelector('.active');
    showResult.innerHTML = `<i class="fas fa-search"></i>「${activeBtn ? activeBtn.textContent : keyWord}」的搜尋結果：`;

};


const toSortBtn = document.querySelectorAll('.toSortBtn');
const sortTable=(sortData)=>{

    toSortBtn.forEach((btn) => {
        btn.addEventListener('click', (e) =>{
            sortType = e.target.parentNode.parentNode.textContent.trim();
            sortData.sort((a, b) => e.target.getAttribute('data-sort') === 'up' ? b[sortType] - a[sortType] : a[sortType] - b[sortType]);
            updatePage(sortData);
        });
    });
};







/* 22小時
4/29 6hrs
    [25% axios API]
    [15% 種類代碼 button]
    [60% select事件監聽]

4/30 8hrs
    [50% 除錯]
    [10% highlight]
    [40% updatePage()畫面渲染]

5/1 4.5hrs
    [100% 簡化程式碼]

5/2 3.5hrs
    [80% toSortBtn]
    [20% 除錯]
*/
