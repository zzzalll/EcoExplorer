window.addEventListener('DOMContentLoaded', function() {
  ;(function(){
  const track = document.querySelector('.gallery-track');
  const slides = track.children;
  let idx = 0;

  document.querySelector('.gallery-btn.next')
    .addEventListener('click', ()=> {
      idx = (idx + 1) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
    });

  document.querySelector('.gallery-btn.prev')
    .addEventListener('click', ()=> {
      idx = (idx - 1 + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
    });
})();
});