(() => {
  const cfg=window.ZAFFENATE_REVIEWS||{};
  const list=document.querySelector('[data-reviews-list]');
  const score=document.querySelector('[data-review-score]');
  const stars=document.querySelector('[data-review-stars]');
  const total=document.querySelector('[data-review-total]');
  const link=document.querySelector('[data-google-reviews-link]');
  if(!list)return;
  if(link&&cfg.googleSearchUrl)link.href=cfg.googleSearchUrl;
  const starHTML=r=>'<span class="stars" aria-label="'+r+' de 5 estrelas">'+Array.from({length:5},(_,i)=>i<Math.round(r)?'★':'☆').join('')+'</span>';
  const escape=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const empty=()=>{list.innerHTML='<div class="review-empty"><strong>Avaliações reais da Zaffenate no Google</strong><p>Não foi possível sincronizar os comentários neste carregamento. Você ainda pode consultar todas as avaliações diretamente no Google.</p><a class="btn btn-outline" href="'+escape(cfg.googleSearchUrl||'#')+'" target="_blank" rel="noopener">Ver avaliações no Google</a></div>'};
  window.initZaffenateReviews=async()=>{
    try{
      const place=new google.maps.places.Place({id:cfg.placeId});
      await place.fetchFields({fields:['displayName','rating','userRatingCount','reviews','googleMapsURI']});
      const rating=place.rating||0;
      if(score)score.textContent=rating?rating.toFixed(1).replace('.',','):'—';
      if(stars)stars.innerHTML=starHTML(rating||5);
      if(total)total.textContent=place.userRatingCount?`${place.userRatingCount} avaliações no Google`:'Avaliações no Google';
      if(link&&place.googleMapsURI)link.href=place.googleMapsURI;
      const reviews=(place.reviews||[]).slice(0,cfg.maxReviews||6);
      if(!reviews.length){empty();return}
      list.innerHTML=reviews.map(r=>{
        const name=r.authorAttribution?.displayName||'Cliente Google';
        const photo=r.authorAttribution?.photoURI;
        const text=typeof r.text==='string'?r.text:(r.text?.text||'');
        const when=r.relativePublishTimeDescription||'';
        return `<article class="review-card"><div class="review-user">${photo?`<img src="${escape(photo)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:`<div class="avatar" aria-hidden="true">${escape(name.charAt(0).toUpperCase())}</div>`}<div><div class="review-name">${escape(name)}</div><div>${starHTML(r.rating||5)}</div></div></div><p class="review-text">${escape(text)}</p>${when?`<div class="review-meta">${escape(when)} · Google</div>`:''}</article>`
      }).join('');
    }catch(err){console.warn('Avaliações Google indisponíveis',err);empty()}
  };
  if(!cfg.googleMapsApiKey||!cfg.placeId){empty();return}
  const s=document.createElement('script');s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(cfg.googleMapsApiKey)}&libraries=places&callback=initZaffenateReviews&loading=async`;s.async=true;s.defer=true;s.onerror=empty;document.head.appendChild(s);
})();
