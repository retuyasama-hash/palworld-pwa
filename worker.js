const UPSTREAM="https://palworld-game-bcy.pages.dev";
const V="0.7.73";

const PATCH=`
<style id="v0738CenterRifleFix">
/* v0.7.38 FIX — 中央盤面を大きくし、左右パネルを圧縮 */
.app.v04.v0738CenterRifleFix .v04Shell{
  grid-template-columns:minmax(108px,10%) minmax(0,1fr) minmax(118px,11%)!important;
  gap:3px!important;
}

/* 左のカード詳細は「確認用」に縮小。盤面を主役にする */
.app.v04.v0738CenterRifleFix .v04Detail{
  padding:3px!important;
  gap:2px!important;
  grid-template-rows:auto minmax(0,1fr)!important;
}
.app.v04.v0738CenterRifleFix .v04DetailHead{font-size:8px!important}
.app.v04.v0738CenterRifleFix .v04DetailMeta{font-size:6px!important}
.app.v04.v0738CenterRifleFix .v04Effect{display:none!important}
.app.v04.v0738CenterRifleFix .v04BigOverlay{padding:3px!important}
.app.v04.v0738CenterRifleFix .v04BigName{
  font-size:8px!important;
  margin-bottom:2px!important;
  max-height:20px!important;
  overflow:hidden!important;
}
.app.v04.v0738CenterRifleFix .v04Stat{font-size:6px!important;padding:1px 2px!important}

/* 中央フィールドを最大化 */
.app.v04.v0738CenterRifleFix .v04Play{
  width:100%!important;
  height:100%!important;
  max-height:none!important;
  margin:0!important;
  align-self:stretch!important;
  justify-self:stretch!important;
  grid-template-rows:minmax(0,1fr) 94px!important;
  gap:3px!important;
  overflow:visible!important;
}
.app.v04.v0738CenterRifleFix .v04Play>.board{
  width:100%!important;
  height:100%!important;
  min-height:0!important;
}
.app.v04.v0738CenterRifleFix .v04Play .side{
  grid-template-columns:54px minmax(0,1fr) 58px!important;
}
.app.v04.v0738CenterRifleFix .v04Play .field{
  grid-template-rows:minmax(0,1fr) 36px!important;
}
.app.v04.v0738CenterRifleFix .v04Play .zone{font-size:7px!important}
.app.v04.v0738CenterRifleFix .v04Play .card .name{font-size:7px!important}
.app.v04.v0738CenterRifleFix .v04Play .card .stats{font-size:6px!important}

/* 自分の手札は画面内に維持 */
.app.v04.v0738CenterRifleFix .v04HandBar{
  height:94px!important;
  min-height:94px!important;
  padding:1px 3px 2px!important;
  overflow:visible!important;
}
.app.v04.v0738CenterRifleFix .v04Hand{
  padding:7px 6px 2px!important;
  overflow:visible!important;
}
.app.v04.v0738CenterRifleFix .v04Hand>.card{
  height:86px!important;
  width:65px!important;
  flex-basis:65px!important;
}

/* 右操作欄も少し圧縮 */
.app.v04.v0738CenterRifleFix .v04Controls{
  padding:2px!important;
  gap:2px!important;
}
.app.v04.v0738CenterRifleFix .v04PlayerBox{padding:3px!important}
.app.v04.v0738CenterRifleFix .v04PlayerTitle{font-size:8px!important}
.app.v04.v0738CenterRifleFix .v04PlayerStats,
.app.v04.v0738CenterRifleFix .v04Resources{font-size:6.5px!important;line-height:1.3!important}
.app.v04.v0738CenterRifleFix .v04Phase{padding:3px!important}
.app.v04.v0738CenterRifleFix .v04Phase b{font-size:9px!important}
.app.v04.v0738CenterRifleFix .v04Btn{font-size:6.5px!important;padding:4px 2px!important}

/* 相手手札は枚数だけ */
.app.v04.v0738CenterRifleFix .v046HandBadge,
.app.v04.v0738CenterRifleFix .v046DeckSub{display:none!important}
.app.v04.v0738CenterRifleFix .v0738CpuCompact{
  display:inline-flex!important;
  align-items:center!important;
  gap:4px!important;
  white-space:nowrap!important;
  font-weight:900!important;
}
.app.v04.v0738CenterRifleFix .v0738CpuCompact b{color:#ffe68b!important}

/* Android縦持ち＋CSS横回転でも中央盤面を同じ比率へ */
@media (orientation:portrait){
  .app.v04.v0738CenterRifleFix .v04Shell{
    grid-template-columns:minmax(105px,9.5%) minmax(0,1fr) minmax(114px,10.5%)!important;
  }
  .app.v04.v0738CenterRifleFix .v04Play{
    grid-template-rows:minmax(0,1fr) 92px!important;
  }
  .app.v04.v0738CenterRifleFix .v04HandBar{
    height:92px!important;
    min-height:92px!important;
  }
}
</style>

<script id="v0738CenterRifleFixScript">
(()=>{
  let scheduled=false;
  let rotateSwipe=null;
  let tapPatched=false;

  function portraitRotated(){
    try{
      if(!matchMedia('(orientation:portrait)').matches)return false;
      const t=getComputedStyle(document.body).transform;
      return !!t&&t!=='none';
    }catch(_e){return innerHeight>innerWidth}
  }

  function patchTap(){
    if(tapPatched)return;
    try{
      if(typeof v0725TapHand!=='function'||typeof v0725TryPlay!=='function')return;
      const base=v0725TapHand;
      v0725TapHand=function(uid){
        uid=Number(uid);
        try{
          /* 同じ手札をもう一度タップしたら使用。スワイプ失敗時の保険にもなる */
          if(v0725SelectedHandUid===uid){
            const c=G?.p?.hand?.find(x=>x.uid===uid);
            if(c&&canPlay(G.p,c)){
              v0725TryPlay(uid);
              return;
            }
          }
        }catch(_e){}
        return base(uid);
      };
      tapPatched=true;
    }catch(_e){}
  }

  function bindRotatedSwipe(){
    if(document.documentElement.dataset.v0738RotateSwipeBound==='1')return;
    document.documentElement.dataset.v0738RotateSwipeBound='1';

    document.addEventListener('pointerdown',ev=>{
      if(!portraitRotated())return;
      const card=ev.target?.closest?.('.v04Hand>.card[data-uid]');
      if(!card||ev.target?.closest?.('.infoBtn'))return;
      rotateSwipe={
        uid:Number(card.dataset.uid),
        pointerId:ev.pointerId,
        x:ev.clientX,
        y:ev.clientY
      };
    },true);

    document.addEventListener('pointerup',ev=>{
      const g=rotateSwipe;rotateSwipe=null;
      if(!g||g.pointerId!==ev.pointerId||!portraitRotated())return;

      /*
       bodyを rotate(90deg) している時：
       アプリ上の「↑」は物理画面では右方向。
       そのため clientY ではなく +clientX を上スワイプとして判定。
      */
      const dx=ev.clientX-g.x,dy=ev.clientY-g.y;
      if(dx>30&&Math.abs(dx)>Math.abs(dy)*0.7){
        try{
          ev.preventDefault();
          ev.stopPropagation();
          if(typeof lpSuppressUntil!=='undefined')
            lpSuppressUntil=Math.max(lpSuppressUntil,Date.now()+420);
          v0725TryPlay(g.uid);
        }catch(_e){}
      }
    },true);

    document.addEventListener('pointercancel',()=>{rotateSwipe=null},true);
  }

  function apply(){
    scheduled=false;
    try{
      const app=document.querySelector('.app.v04');
      if(app){
        app.classList.add(
          'v0738CenterRifleFix',
          'v0738FieldFirst',
          'v0738HandInside',
          'v0725HandUI',
          'v0726HandFixed'
        );
      }

      const title=document.querySelector('.v04Title');
      if(title&&title.textContent!=='v0.7.61')
        title.textContent='v0.7.67';

      /* 起動画面のバージョン表示もWorker実装と同期 */
      document.querySelectorAll('.badge.official').forEach(b=>{
        if(/^v?0\.7\.\d+/.test((b.textContent||'').trim())) b.textContent='v0.7.70';
      });

      /* CPUは手札カードを見せず枚数だけ */
      const stats=document.querySelector('.v04PlayerBox.cpu .v04PlayerStats');
      if(stats&&globalThis.G&&G.a){
        const sig=[G.a.life,G.a.deck.length,G.a.hand.length].join('/');
        if(stats.dataset.v0738CenterSig!==sig){
          stats.dataset.v0738CenterSig=sig;
          stats.innerHTML=
            '<span class="v0738CpuCompact">♥'+G.a.life+
            '　山札 '+G.a.deck.length+
            '　<b>手札 '+G.a.hand.length+'枚</b></span>';
        }
      }

      patchTap();
      bindRotatedSwipe();

      const caption=document.querySelector('.v0725HandCaption.playable');
      if(caption&&caption.textContent.includes('上へスワイプで使用'))
        caption.textContent=caption.textContent.replace(
          '↑ 上へスワイプで使用',
          '↑ スワイプ または もう一度タップで使用'
        );
    }catch(_e){}
  }

  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(apply);
  }

  try{
    new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  }catch(_e){}

  addEventListener('pageshow',apply,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)apply()});

  apply();
  setTimeout(apply,250);
  setTimeout(apply,1000);
})();
</script>

<script id="v0742OfficialRuleSyncPatch">
(()=>{
  if(globalThis.__v0742OfficialRuleSyncApplied)return;
  globalThis.__v0742OfficialRuleSyncApplied=true;

  let stateBusy=false;

  /* Q74 root-cause fix:
     "Main Name" must be determined from the card name, never from rules/effect text.
     The old helper also searched abilityEn/ability.  Elizabee's own effect contains
     the word "Beegarde", so Elizabee incorrectly counted itself as a Beegarde.
     With 1 real Beegarde, 700 + 300 became 1300 instead of the official 1000,
     and after Beegarde left the Base Elizabee incorrectly stayed at 1000. */
  if(typeof v073CardHasMainName==='function'){
    v073CardHasMainName=function(card,mainName){
      if(!card)return false;
      const wanted=String(mainName||'').trim().toLowerCase();
      if(!wanted)return false;

      const normalize=x=>String(x||'')
        .replace(/[‐‑‒–—―−]/g,'-')
        .replace(/\s+/g,' ')
        .trim()
        .toLowerCase();

      const names=[card.enName,card.name].filter(Boolean).map(normalize);
      const w=normalize(wanted);

      /* Main name is the name before the subtitle separator where present.
         Full-name startsWith is kept as a fallback for synchronized data. */
      return names.some(n=>{
        const main=n.split(/\s+-\s+/)[0].trim();
        return main===w || n===w || n.startsWith(w+' - ');
      });
    };
  }

  function stateCheck(){
    if(stateBusy || typeof G==='undefined' || !G || G.over)return;
    stateBusy=true;
    try{
      /* Q74/Q93: after a Power-changing state/effect, a damaged Pal whose
         Damage is now >= Power is immediately put into the graveyard.
         Q92 remains intact because resolveLethal requires damage > 0. */
      resolveLethal(G.p);
      if(!G.over)resolveLethal(G.a);
    }catch(e){
      console.error('official state check',e);
    }finally{
      stateBusy=false;
    }
  }

  /* Q74 — re-evaluate continuous Power when a card leaves the Base. */
  if(typeof removePalToGrave==='function'){
    const baseRemovePal=removePalToGrave;
    removePalToGrave=function(pl,c,why=''){
      const r=baseRemovePal(pl,c,why);
      stateCheck();
      return r;
    };
  }
  if(typeof removeSupportToGrave==='function'){
    const baseRemoveSupport=removeSupportToGrave;
    removeSupportToGrave=function(pl,c,why=''){
      const r=baseRemoveSupport(pl,c,why);
      stateCheck();
      return r;
    };
  }

  /* Q93 — generic BP01 Power reductions must run the state check
     after the whole card effect finishes. */
  if(typeof v050ResolveActionText==='function'){
    const baseActionText=v050ResolveActionText;
    v050ResolveActionText=function(pl,c,text,done=()=>{}){
      const t=String(text||'');
      if(/(?:gets?|Power)\s*[-−]\s*\d+/i.test(t) || /Power-\d+/i.test(t)){
        return baseActionText(pl,c,t,()=>{
          stateCheck();
          done();
        });
      }
      return baseActionText(pl,c,t,done);
    };
  }

  /* TD02-012 Astegon uses an older dedicated On Deploy route.
     Capture the callback created by chooseTarget and state-check after -1000. */
  if(typeof resolveOnDeploy==='function' && typeof chooseTarget==='function'){
    const baseOnDeploy=resolveOnDeploy;
    resolveOnDeploy=function(pl,c){
      if(String(c?.no||'')!=='TD02-012')return baseOnDeploy(pl,c);
      const oldChoose=chooseTarget;
      chooseTarget=function(...args){
        const cb=args[4];
        if(typeof cb==='function'){
          args[4]=function(x){
            const r=cb(x);
            stateCheck();
            return r;
          };
        }
        return oldChoose(...args);
      };
      try{
        return baseOnDeploy(pl,c);
      }finally{
        chooseTarget=oldChoose;
      }
    };
  }

  /* EBP01-084 Menasting / BP01-084 デスティング.
     Existing engine handled Retaliate only when Menasting was the defender.
     Official text works whenever it is put into the graveyard during battle,
     so the attacking Menasting path is added here as well. */
  if(typeof resolveBattle==='function'){
    const baseBattle=resolveBattle;
    resolveBattle=function(attOwner,atk,target){
      const def=other(attOwner);
      const targetCard=target?.type==='pal'
        ? def?.pals?.find(x=>x.uid===target.uid)
        : null;
      const atkUid=atk?.uid;
      const tarUid=targetCard?.uid;
      const attackerRetaliate=!!(atk && (atk.retaliate || /Retaliate|相打ち/i.test(String(typeof v050T==='function'?v050T(atk):atk.ability||''))));
      const defenderRetaliate=!!(targetCard && (targetCard.retaliate || /Retaliate|相打ち/i.test(String(typeof v050T==='function'?v050T(targetCard):targetCard.ability||''))));

      const r=baseBattle(attOwner,atk,target);
      if(typeof G==='undefined' || !G || G.over || target?.type!=='pal')return r;

      let changed=false;
      const atkDead=!!attOwner?.grave?.some(x=>x.uid===atkUid);
      const tarDead=!!def?.grave?.some(x=>x.uid===tarUid);

      /* Attacking Menasting died, opposing combat Pal survived. */
      if(attackerRetaliate && atkDead){
        const liveTarget=def?.pals?.find(x=>x.uid===tarUid);
        if(liveTarget){
          removePalToGrave(def,liveTarget,'相打ち');
          log(String(atk.name||'')+': 相打ち');
          changed=true;
        }
      }

      /* Fallback for defender-side Retaliate. Older engine normally already
         resolves this, so this branch only acts if the attacker is still alive. */
      if(defenderRetaliate && tarDead){
        const liveAtk=attOwner?.pals?.find(x=>x.uid===atkUid);
        if(liveAtk){
          removePalToGrave(attOwner,liveAtk,'相打ち');
          log(String(targetCard.name||'')+': 相打ち');
          changed=true;
        }
      }

      if(changed && !G.over)render();
      return r;
    };
  }

  /* EBP01-084 / BP01-084 test-harness correction.
     The built-in v0.7.6 probe checks the hand before the v0.7.13 AUTO queue is
     flushed.  Also, several eligible Normal Pals can already exist in the test
     graveyard, so checking one specific uid is incorrect: the AI is allowed to
     return a different eligible Normal Pal.
     Re-test BP01-084 after the original test using the official condition:
       Base -> graveyard, flush AUTO, then confirm that ANY Normal Pal that was
       eligible before the AUTO moved from graveyard to hand. */
  function v0740ProbeMenasting(c){
    const {p,a}=v072PrepareBpWorld(c),card=v071Fresh(c.no);
    card.bpGeneric=true;
    Object.assign(card,v050KeywordFlags(card.abilityEn,card.ability));
    v071ForceRunning=true;
    try{
      let candidates=p.grave.filter(x=>x.kind==='Pal'&&/Normal Pal/i.test(String(x.subtype||'')));
      if(!candidates.length){
        const def=Object.values(CARD_DB).find(x=>x.kind==='Pal'&&/Normal Pal/i.test(String(x.subtype||'')));
        if(def){
          const z=v071Fresh(def.no);
          p.grave.unshift(z);
          candidates=[z];
        }
      }
      if(!candidates.length)return false;

      const eligible=new Set(candidates.map(x=>x.uid));
      p.pals.push(card);
      removePalToGrave(p,card,'BP01-084公式同期テスト');

      if(typeof v0713FlushAutos==='function')v0713FlushAutos(G);

      return p.hand.some(x=>eligible.has(x.uid));
    }catch(e){
      console.error('BP01-084 v0.7.54 official probe',e);
      return false;
    }finally{
      v071ForceRunning=false;
      G=null;
      pendingBlock=pendingChoice=pendingQuick=null;
      v075ModeChoice=null;
      try{pendingUse=null;pendingPlacement=null}catch(_e){}
    }
  }

  if(typeof v072TestBpCard==='function'){
    const baseBpCardTest=v072TestBpCard;
    v072TestBpCard=function(c){
      const r=baseBpCardTest(c);
      if(String(c?.no||'')!=='BP01-084')return r;

      const ok=v0740ProbeMenasting(c);
      if(ok){
        r.status='ok';
        r.reasons=['v0.7.54公式処理ルートを実行（墓地AUTO解決後にNormal Pal回収を確認）'];
      }else{
        r.status='mismatch';
        r.reasons=['v0.7.54デスティング墓地AUTO確認に失敗'];
      }
      return r;
    };
  }

  /* Game setup: Quick Manual says mulligan decisions are made starting with
     the first player. Fix the CPU-vs-CPU utility mode accordingly. */
  if(typeof setupCpuVsCpu==='function'){
    setupCpuVsCpu=function(pKey,aKey,firstChoice,diff){
      UID=0;
      pendingBlock=pendingChoice=pendingQuick=null;
      const p=makePlayer('CPU 1',pKey,true),a=makePlayer('CPU 2',aKey,true);
      const first=firstChoice==='random'?(Math.random()<.5?'p':'a'):firstChoice;
      G={p,a,first,turn:first,turnSeq:1,phase:'SETUP',selected:null,logs:[],over:false,winner:null,reason:null,diff,aiMulliganDone:true,cpuVsCpu:true};
      if(first==='p')addSouls(a,1);else addSouls(p,1);
      draw(p,5,false);draw(a,5,false);

      const firstPl=first==='p'?p:a,secondPl=first==='p'?a:p;
      if(aiShouldMulligan(firstPl))doMulligan(firstPl);
      if(aiShouldMulligan(secondPl))doMulligan(secondPl);

      if(typeof v077Stress!=='undefined' && v077Stress.active && v077Stress.currentMeta){
        try{
          v079FocusIntoOpeningHand(p,v077Stress.currentMeta.p.focusNo);
          v079FocusIntoOpeningHand(a,v077Stress.currentMeta.a.focusNo);
        }catch(_e){}
      }

      log('先攻: '+(first==='p'?'CPU 1':'CPU 2')+' / 後攻はソウル1枚で開始');
      G.phase='READY';
      render();
      v070Schedule(beginTurn,350);
    };
  }

  /* Remote P2P: older flow always made the host decide mulligan first.
     When the guest is the first player, let guest decide first, then host. */
  if(typeof v060HostStartGame==='function' && typeof playerMulligan==='function' && typeof v060Handle==='function'){
    const baseP2PMulligan=playerMulligan;
    const baseP2PHandle=v060Handle;
    const baseP2PRenderMulligan=renderMulligan;

    v060HostStartGame=function(){
      if(!v060.connected||!v060.remoteDeck)return;
      const remoteId=v060RegisterRemoteDeck(v060.remoteDeck),localId=v060.localDeck;
      if(!DECKS[localId]||!remoteId)return alert('デッキを読み込めませんでした');

      UID=0;
      pendingBlock=pendingChoice=pendingQuick=pendingUse=pendingPlacement=null;
      detailUid=null;

      const p=makePlayer('YOU',localId,false),a=makePlayer('OPPONENT',remoteId,false);
      const first=v060.first==='random'?(Math.random()<.5?'p':'a'):v060.first;
      G={p,a,first,turn:first,turnSeq:1,phase:'SETUP',selected:null,logs:[],over:false,winner:null,reason:null,diff:'normal',aiMulliganDone:true};
      if(first==='p')addSouls(a,1);else addSouls(p,1);
      draw(p,5,false);draw(a,5,false);
      log('先攻: '+(first==='p'?'YOU':'OPPONENT')+' / 後攻はソウル1枚で開始');

      v060.mode='p2p';v060.game=true;v060.role='host';
      v060.hostMulliganDone=false;v060.guestMulliganDone=false;

      if(first==='p'){
        renderMulligan();
      }else{
        v060.waitingText='先攻プレイヤーのマリガン選択を待っています…';
        v060SendObj({type:'v0738_mulligan_first_start',state:v060PackState(true)});
        v060ShowWaiting(v060.waitingText);
      }
    };

    renderMulligan=function(){
      const r=baseP2PRenderMulligan();
      try{
        if(v060.mode==='p2p'&&v060.game&&G){
          const h=document.querySelector('.v060Mull h2');
          if(h)h.textContent='初手5枚 — '+(G.first==='p'?'あなたが先攻':'あなたが後攻');
          const g=document.querySelector('.v060Mull .good');
          if(g)g.textContent='マリガンは先攻プレイヤーから順に選択します。引き直す場合は5枚すべてを戻して5枚引き直します。';
        }
      }catch(_e){}
      return r;
    };

    playerMulligan=function(yes){
      if(v060.mode!=='p2p'||!v060.game)return baseP2PMulligan(yes);

      /* Existing path is already correct for host-first games. */
      if((v060.role==='host'&&G.first==='p') || (v060.role==='guest'&&G.first==='a')){
        return baseP2PMulligan(yes);
      }

      if(yes)doMulligan(G.p);
      G.p.mulligan=!!yes;

      /* Guest is first player: send its decision to host. */
      if(v060.role==='guest'&&G.first==='p'){
        v060.guestMulliganDone=true;
        v060.waitingText='後攻プレイヤーのマリガン選択を待っています…';
        v060SendObj({type:'v0738_mulligan_first_done',state:v060PackState(true)});
        v060ShowWaiting(v060.waitingText);
        return;
      }

      /* Host is second player: after its decision, setup is complete. */
      if(v060.role==='host'&&G.first==='a'){
        v060.hostMulliganDone=true;
        G.phase='READY';
        v060SendObj({type:'v0738_mulligan_all_done',state:v060PackState(true)});
        v060.waitingText='';
        v060RenderSafe();
        v070Schedule(beginTurn,140);
        return;
      }
    };

    v060Handle=function(m){
      if(m?.type==='v0738_mulligan_first_start'){
        v060.mode='p2p';v060.game=true;v060.role='guest';
        v060ApplyPackedState(m.state);
        v060.guestMulliganDone=false;
        v060.waitingText='';
        renderMulligan();
        return;
      }
      if(m?.type==='v0738_mulligan_first_done'&&v060.role==='host'){
        v060ApplyPackedState(m.state);
        v060.guestMulliganDone=true;
        v060.hostMulliganDone=false;
        v060.waitingText='';
        renderMulligan();
        return;
      }
      if(m?.type==='v0738_mulligan_all_done'&&v060.role==='guest'){
        v060ApplyPackedState(m.state);
        v060.guestMulliganDone=true;
        G.phase='READY';
        v060.waitingText='';
        v060RenderSafe();
        return;
      }
      return baseP2PHandle(m);
    };
  }

  /* Add direct regression cases to the in-app Official Ruling Test. */
  if(typeof v0712ScenarioCases==='function' && typeof v0712RunCase==='function'){
    const baseCases=v0712ScenarioCases;
    v0712ScenarioCases=function(){
      const xs=baseCases();

      xs.push(()=>v0712RunCase(
        'R19','Q74',
        'CONTによるPower上昇が失われた直後に致死判定する',
        '低下後Power以下でないDamageなら残り、Damage>=Powerなら墓地',
        '公式Q&A Q74',
        ()=>v0712Sandbox(({p})=>{
          const queen=v0712Card('BP01-053'),bee=v0712Card('BP01-061');
          p.pals=[queen,bee];
          const base=Number(queen.power||0);
          queen.damage=base;
          const boosted=powerOf(queen);
          removePalToGrave(p,bee,'Q74テスト');
          stateCheck();
          const dead=p.grave.some(x=>x.uid===queen.uid);
          return v0712Out(boosted>base&&dead,'基礎Power='+base+' / CONT中='+boosted+' / 墓地='+dead);
        })
      ));

      xs.push(()=>v0712RunCase(
        'R20','Q93',
        'Power減少で既存Damage以上になったPalを墓地へ置く',
        'Power低下後にDamage>=Powerなら即座に墓地',
        '公式Q&A Q93',
        ()=>v0712Sandbox(({p})=>{
          const pal=v0712Card('TD01-002');
          p.pals=[pal];
          pal.damage=200;
          pal.tempPower=-200;
          stateCheck();
          const dead=p.grave.some(x=>x.uid===pal.uid);
          return v0712Out(dead,'Damage=200 / 低下後Power='+powerOf(pal)+' / 墓地='+dead);
        })
      ));

      xs.push(()=>v0712RunCase(
        'R21','EBP01-084',
        'デスティングの相打ちは攻撃側で墓地になった場合も発動する',
        '攻撃側デスティングが戦闘で墓地→相手の戦闘Palも墓地',
        '公式カード EBP01-084',
        ()=>v0712Sandbox(({p,a})=>{
          const men=v0712Card('BP01-084'),mamm=v0712Card('TD02-007');
          men.retaliate=true;
          p.pals=[men];a.pals=[mamm];
          mamm.rest=true;
          resolveBattle(p,men,{type:'pal',uid:mamm.uid});
          if(typeof v0713FlushAutos==='function')v0713FlushAutos(G);
          const menDead=p.grave.some(x=>x.uid===men.uid);
          const mammDead=a.grave.some(x=>x.uid===mamm.uid);
          return v0712Out(menDead&&mammDead,'デスティング墓地='+menDead+' / 相手戦闘Pal墓地='+mammDead);
        })
      ));

      return xs;
    };
  }

  /* Make reports identify this Worker-level rules synchronization accurately. */
  if(typeof v072RunBP01Tests==='function'){
    const baseRunBp=v072RunBP01Tests;
    v072RunBP01Tests=async function(){
      await baseRunBp();
      if(v072BpReport){
        v072BpReport.version='0.7.64 Tier Legal Guard + Full Test + Diagnostics + Official Sync';
        v072BpReport.ruleSync='Q74 Main Name + Q93 boundary + BP01-084 AUTO queue + official rules';
        try{
          localStorage.setItem(V072_BP_REPORT_KEY,JSON.stringify(v072BpReport));
          if(typeof V075_BP_REPORT_KEY!=='undefined')localStorage.setItem(V075_BP_REPORT_KEY,JSON.stringify(v072BpReport));
        }catch(_e){}
      }
    };
  }

  if(typeof render==='function'){
    const baseRenderOfficial=render;
    render=function(){
      const r=baseRenderOfficial();
      try{
        const title=document.querySelector('.v04Title');
        if(title && !G?.cpuVsCpu)title.textContent='v0.7.67';
      }catch(_e){}
      return r;
    };
  }


  /* Main Name false-positive regression: Elizabee's effect text mentions
     Beegarde, but that must not make Elizabee itself a Beegarde. */
  if(typeof v0712ScenarioCases==='function' && typeof v0712RunCase==='function'){
    const baseCasesMainName=v0712ScenarioCases;
    v0712ScenarioCases=function(){
      const xs=baseCasesMainName();
      xs.push(()=>v0712RunCase(
        'R22','Main Name',
        'Main Name判定は効果文ではなくカード名だけを見る',
        'クインビーナ単体=700 / ビーナイト1体で=1000',
        '公式カード BP01-053 + Q74',
        ()=>v0712Sandbox(({p})=>{
          const queen=v0712Card('BP01-053');
          p.pals=[queen];
          const solo=powerOf(queen);
          const bee=v0712Card('BP01-061');
          p.pals.push(bee);
          const withOne=powerOf(queen);
          return v0712Out(
            solo===700 && withOne===1000,
            '単体='+solo+' / ビーナイト1体='+withOne
          );
        })
      ));
      return xs;
    };
  }


  /* Strengthen three ruling tests that previously could pass/fail for the wrong reason.
     R12 now reproduces official Q65 exactly (Strike 3 -> Wumpo -1 -> 2).
     R19 checks Elizabee 700 -> 1000 with exactly one real Beegarde, then Q74 death.
     R20 checks both sides of Q93's Damage >= Power boundary. */
  if(typeof v0712ScenarioCases==='function' && typeof v0712RunCase==='function'){
    const baseCasesOfficialBoundary=v0712ScenarioCases;
    v0712ScenarioCases=function(){
      return baseCasesOfficialBoundary().map(original=>()=> {
        const oldResult=original();
        if(oldResult?.id==='R12'){
          return v0712RunCase(
            'R12','Q65',
            'Wumpoが戦闘で墓地へ行ってもBreakthroughは低下後Strikeを使う',
            '10ソウルのドリタスはStrike 3、Wumpoで2になり、Breakthroughも2ダメージ',
            '公式Q&A Q65',
            ()=>v0712Sandbox(({p,a})=>{
              v0712Souls(p,10);
              const atk=v0712Card('BP01-050'),w=v0712Card('BP01-033');
              atk.breakthrough=true;
              atk.tempPower=(atk.tempPower||0)+10000;
              w.rest=true;
              p.pals=[atk];a.pals=[w];
              v0712FillDeck(a,30);
              const strikeBefore=strikeOf(atk);
              const life=a.life;
              resolveBattle(p,atk,{type:'pal',uid:w.uid});
              const lost=life-a.life;
              return v0712Out(
                strikeBefore===2 && lost===2,
                'Wumpo適用中Strike='+strikeBefore+' / Breakthrough='+lost
              );
            })
          );
        }
        if(oldResult?.id==='R19'){
          return v0712RunCase(
            'R19','Q74',
            'CONTによるPower上昇が失われた直後に致死判定する',
            'クインビーナ700→ビーナイト1体で1000。Damage700なら強化中は残り、ビーナイト離脱直後に墓地',
            '公式Q&A Q74',
            ()=>v0712Sandbox(({p})=>{
              const queen=v0712Card('BP01-053'),bee=v0712Card('BP01-061');
              p.pals=[queen,bee];
              queen.damage=700;
              const boosted=powerOf(queen);
              const aliveWhileBoosted=p.pals.some(x=>x.uid===queen.uid);
              removePalToGrave(p,bee,'Q74境界テスト');
              stateCheck();
              const dead=p.grave.some(x=>x.uid===queen.uid);
              return v0712Out(
                boosted===1000 && aliveWhileBoosted && dead,
                '基礎700 / CONT中='+boosted+' / 強化中生存='+aliveWhileBoosted+' / 離脱後墓地='+dead
              );
            })
          );
        }
        if(oldResult?.id==='R20'){
          return v0712RunCase(
            'R20','Q93',
            'Power減少でDamageがPower以上になったPalを墓地へ置く',
            'Power低下後、DamageがPower未満なら残り、DamageがPowerと同値なら即座に墓地',
            '公式Q&A Q93',
            ()=>v0712Sandbox(({p})=>{
              const safe=v0712Card('TD01-002'),dead=v0712Card('TD01-002');
              const basePowerSafe=powerOf(safe);
              const basePowerDead=powerOf(dead);

              /* 先に既存Damageを与え、その後Powerを-200する。
                 Q93の「既に受けているDamage」に対する境界をそのまま再現する。 */
              safe.tempPower=-200;
              dead.tempPower=-200;
              const loweredSafe=powerOf(safe);
              const loweredDead=powerOf(dead);

              safe.tempPower=0;
              dead.tempPower=0;
              safe.damage=Math.max(0,loweredSafe-1);
              dead.damage=Math.max(0,loweredDead);
              safe.tempPower=-200;
              dead.tempPower=-200;

              p.pals=[safe,dead];
              stateCheck();

              const safeStayed=p.pals.some(x=>x.uid===safe.uid);
              const deadMoved=p.grave.some(x=>x.uid===dead.uid);
              return v0712Out(
                loweredSafe===loweredDead && safeStayed && deadMoved,
                '基礎Power='+basePowerSafe+
                ' / 低下後Power='+loweredDead+
                ' / Damage'+Math.max(0,loweredSafe-1)+'残存='+safeStayed+
                ' / Damage'+Math.max(0,loweredDead)+'墓地='+deadMoved
              );
            })
          );
        }
        return oldResult;
      });
    };
  }

  console.info('Palworld OCG v0.7.54 placement + structure attack + official rule sync applied: BP01-084 / Q74 / Q93 / mulligan order');
})();
</script>

<style id="v0745CombatUX">
/* v0.7.48 — battle UX inspired by a compact digital-card-game flow.
   Gameplay/rules are untouched: this layer only changes guidance, modals and FX. */
.app.v04.v0745CombatUX .v04Play{position:relative!important}

/* Selected attacker + legal targets are obvious at a glance. */
.app.v04.v0745CombatUX .v04Play .card.attackSelected{
  outline:2px solid #ff665a!important;
  box-shadow:0 0 0 2px #240000aa inset,0 0 16px #ff4d3dcc!important;
  transform:translateY(-2px) scale(1.025);
  z-index:8;
}
.app.v04.v0745CombatUX .v04Play .zone.validTarget,
.app.v04.v0745CombatUX .v04Play .stack.target{
  border-color:#ffd95b!important;
  box-shadow:0 0 0 1px #fff1a8 inset,0 0 14px #ffd95b99!important;
  animation:v0745TargetPulse .72s ease-in-out infinite alternate;
}
.app.v04.v0745CombatUX .v04Play .zone.validTarget .card{
  filter:brightness(1.12) saturate(1.12);
}
@keyframes v0745TargetPulse{
  from{filter:brightness(.94)}
  to{filter:brightness(1.18)}
}

/* Small instruction chip, instead of making the player scan the side controls. */
.v0745CombatHint{
  position:absolute;left:50%;top:4px;transform:translateX(-50%);
  z-index:32;display:none;align-items:center;gap:6px;
  max-width:72%;padding:4px 10px;border-radius:999px;
  border:1px solid #e3c45e;background:#071410ee;color:#f9f1d0;
  box-shadow:0 4px 16px #000b;font-size:8px;font-weight:950;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none;
}
.v0745CombatHint.show{display:flex}
.v0745CombatHint:before{content:"⚔";color:#ffd85e;font-size:10px}

/* Battle reaction sheet: compact, bottom-oriented and focused on the current choice. */
.modal.v0745CombatModal{
  position:fixed!important;inset:0!important;z-index:2147482600!important;
  align-items:flex-end!important;justify-content:center!important;
  padding:4px!important;background:#0006!important;backdrop-filter:blur(1.5px);
}
.modal.v0745CombatModal>.modalCard{
  width:min(440px,78vw)!important;max-width:440px!important;
  max-height:34vh!important;overflow:auto!important;
  padding:6px!important;border-radius:14px 14px 8px 8px!important;
  border:1px solid #d2b64f!important;
  background:linear-gradient(180deg,#0c1d2a,#08130f 72%)!important;
  box-shadow:0 -10px 32px #000c!important;
}
.v0745CombatHead{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px}
.v0745CombatHead h2{margin:0!important;font-size:11px!important;color:#ffe072!important}
.v0745CombatSub{font-size:7px;color:#c6d8cf;line-height:1.3;margin-top:1px}
.v0745CombatCards{display:flex;gap:7px;overflow-x:auto;padding:2px 1px 5px;align-items:stretch}
.v0745CombatChoice{
  flex:0 0 62px;border:1px solid #557568;border-radius:10px;background:#071711;
  padding:4px;cursor:pointer;box-shadow:0 3px 10px #0008;
}
.v0745CombatChoice .card{height:62px!important;width:54px!important;min-width:54px!important;margin:0 auto 4px!important}
.v0745CombatChoice .v0745ChoiceLabel{
  display:block;text-align:center;border-radius:7px;padding:4px 2px;
  background:#154f3d;border:1px solid #78c9a9;color:#fff;font-size:8px;font-weight:950;
}
.v0745CombatActions{display:flex;gap:6px;margin-top:6px;position:sticky;bottom:0;z-index:5;padding-top:5px;background:linear-gradient(180deg,#08130f00,#08130f 35%)}
.v0745CombatActions button{flex:1!important;padding:6px 4px!important;font-size:8px!important;font-weight:950!important;border-radius:9px!important}
.v0745Skip{background:#372a2a!important;border-color:#8d6868!important}
.v0745QuickRow{display:grid;grid-template-columns:86px minmax(0,1fr);gap:7px;align-items:center;border-top:1px solid #29463a;padding:6px 0}
.v0745QuickRow:first-of-type{border-top:0}
.v0745QuickRow .card{height:88px!important;width:78px!important;min-width:78px!important}
.v0745QuickBtns{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.v0745QuickBtns button{padding:7px 4px!important;font-size:8px!important;font-weight:900!important;border-radius:8px!important}

/* Attack arrow / impact / result toast. Appended to <html>, so body rotation does not distort coordinates. */
#v0745BattleFxLayer{position:fixed;inset:0;z-index:2147483000;pointer-events:none;overflow:hidden}
#v0745BattleFxLayer svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
#v0745BattleFxLayer .v0745AttackLine{
  stroke:#ffe05f;stroke-width:6;stroke-linecap:round;
  filter:drop-shadow(0 0 5px #ff6b3d) drop-shadow(0 0 9px #000);
  stroke-dasharray:14 8;animation:v0745Dash .38s linear infinite;
}
@keyframes v0745Dash{to{stroke-dashoffset:-44}}
.v0745Impact{
  position:fixed;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;
  border:3px solid #fff2a5;box-shadow:0 0 0 4px #ff634788,0 0 22px #ff553e;
  animation:v0745Impact .62s ease-out forwards;
}
@keyframes v0745Impact{from{transform:scale(.35);opacity:1}to{transform:scale(2.7);opacity:0}}
.v0745ResultToast{
  position:fixed;left:50%;top:18%;transform:translate(-50%,-50%) scale(.92);
  min-width:130px;max-width:70vw;padding:7px 12px;border-radius:12px;
  border:1px solid #e8ca5b;background:#07140ff2;color:#fff;text-align:center;
  font-size:10px;font-weight:950;box-shadow:0 7px 22px #000c;
  animation:v0745Toast .72s ease-out forwards;
}
.v0745ResultToast b{color:#ffd85d}
@keyframes v0745Toast{0%{opacity:0;transform:translate(-50%,-44%) scale(.9)}15%,72%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-56%) scale(.98)}}


/* v0.7.48: effect target selectors (e.g. 500 damage) stay compact so the board remains visible. */
.modal.v0745EffectChoice{
  position:fixed!important;inset:0!important;z-index:2147482400!important;
  align-items:flex-end!important;justify-content:center!important;
  padding:4px!important;background:#0006!important;backdrop-filter:blur(1px);
}
.modal.v0745EffectChoice>.modalCard{
  width:min(500px,82vw)!important;max-width:500px!important;max-height:40vh!important;
  overflow:auto!important;padding:6px!important;border-radius:14px 14px 8px 8px!important;
}
.modal.v0745EffectChoice .card{max-height:72px!important;max-width:62px!important}

@media(max-height:520px) and (orientation:landscape){
  .v0745CombatHint{font-size:7px;padding:3px 8px;top:2px}
  .modal.v0745CombatModal>.modalCard{max-height:36vh!important}
  .v0745CombatChoice{flex-basis:58px}.v0745CombatChoice .card{height:58px!important;width:50px!important;min-width:50px!important}
  .v0745ResultToast{top:15%;font-size:8px;padding:5px 9px}
}
</style>

<script id="v0745CombatUXScript">
(()=>{
  if(globalThis.__v0745CombatUXApplied)return;
  globalThis.__v0745CombatUXApplied=true;

  let scheduled=false;
  let lastArrowAt=0;
  let lastPendingBattleSig="";

  const safeText=x=>String(x==null?'':x)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  function playRoot(){return document.querySelector('.v04Play')}
  function uidEl(uid){
    if(uid==null)return null;
    return document.querySelector('.v04Play .card[data-uid="'+Number(uid)+'"]');
  }
  function centerOf(el){
    if(!el)return null;
    const r=el.getBoundingClientRect();
    if(!r.width&&!r.height)return null;
    return {x:r.left+r.width/2,y:r.top+r.height/2};
  }
  function playerStackFor(owner){
    try{
      const side=owner===G?.a?document.querySelector('.v04Play .side.enemy'):document.querySelector('.v04Play .side.player');
      if(!side)return null;
      const edges=side.querySelectorAll(':scope > .edge');
      const edge=edges[edges.length-1];
      return edge?edge.querySelector('.stack'):null;
    }catch(_e){return null}
  }
  function targetEl(attOwner,target){
    if(!target)return null;
    if(target.type==='player'){
      try{return playerStackFor(typeof other==='function'?other(attOwner):null)}catch(_e){return null}
    }
    return uidEl(target.uid);
  }
  function fxLayer(){
    let x=document.getElementById('v0745BattleFxLayer');
    if(x)return x;
    x=document.createElement('div');
    x.id='v0745BattleFxLayer';
    document.documentElement.appendChild(x);
    return x;
  }
  function drawArrowPoints(a,b){
    if(!a||!b)return;
    const layer=fxLayer();
    layer.innerHTML='';
    const ns='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(ns,'svg');
    const defs=document.createElementNS(ns,'defs');
    const marker=document.createElementNS(ns,'marker');
    marker.setAttribute('id','v0745ArrowHead');marker.setAttribute('markerWidth','10');marker.setAttribute('markerHeight','10');
    marker.setAttribute('refX','8');marker.setAttribute('refY','3');marker.setAttribute('orient','auto');marker.setAttribute('markerUnits','strokeWidth');
    const path=document.createElementNS(ns,'path');path.setAttribute('d','M0,0 L0,6 L9,3 z');path.setAttribute('fill','#ffd75a');
    marker.appendChild(path);defs.appendChild(marker);svg.appendChild(defs);
    const line=document.createElementNS(ns,'line');
    line.setAttribute('x1',a.x);line.setAttribute('y1',a.y);line.setAttribute('x2',b.x);line.setAttribute('y2',b.y);
    line.setAttribute('marker-end','url(#v0745ArrowHead)');line.setAttribute('class','v0745AttackLine');svg.appendChild(line);layer.appendChild(svg);
    const impact=document.createElement('div');impact.className='v0745Impact';impact.style.left=b.x+'px';impact.style.top=b.y+'px';layer.appendChild(impact);
    lastArrowAt=Date.now();
    setTimeout(()=>{if(layer&&Date.now()-lastArrowAt>=980)layer.innerHTML=''},1080);
  }
  function arrowBetween(attOwner,atk,target){
    try{drawArrowPoints(centerOf(uidEl(atk?.uid)),centerOf(targetEl(attOwner,target)))}catch(_e){}
  }
  function toast(html){
    try{
      const layer=fxLayer();
      const t=document.createElement('div');t.className='v0745ResultToast';t.innerHTML=html;layer.appendChild(t);
      setTimeout(()=>t.remove(),760);
    }catch(_e){}
  }
  function targetName(ctx){
    try{
      if(!ctx||!ctx.target)return '攻撃対象';
      const def=typeof other==='function'?other(ctx.attOwner):null;
      if(ctx.target.type==='player')return def?.name||'プレイヤー';
      const arr=ctx.target.type==='pal'?def?.pals:def?.supports;
      return arr?.find(x=>x.uid===ctx.target.uid)?.name||'攻撃対象';
    }catch(_e){return '攻撃対象'}
  }

  /* Bottom-sheet battle decisions. The underlying chooseBlock/chooseInterrupt logic is unchanged. */
  if(typeof blockModalHTML==='function'){
    blockModalHTML=function(){
      if(!pendingBlock)return'';
      const head=(pendingBlock.atk?.name||'相手')+' → '+targetName(pendingBlock);
      const rows=(pendingBlock.blockers||[]).map(c=>
        '<div class="v0745CombatChoice" onclick="chooseBlock('+c.uid+')">'+
          cardHTML(c,{select:true})+
          '<span class="v0745ChoiceLabel">ブロック</span></div>'
      ).join('');
      return '<div class="modal v0745CombatModal"><div class="modalCard">'+
        '<div class="v0745CombatHead"><div><h2>ブロックしますか？</h2><div class="v0745CombatSub">'+safeText(head)+'<br>ブロックするパルを選択してください。</div></div></div>'+
        '<div class="v0745CombatCards">'+rows+'</div>'+
        '<div class="v0745CombatActions"><button class="v0745Skip" onclick="chooseBlock(null)">ブロックしない</button></div>'+
        '</div></div>';
    };
  }

  if(typeof quickModalHTML==='function'){
    quickModalHTML=function(){
      if(!pendingQuick)return'';
      const rows=(pendingQuick.ints||[]).map(c=>
        '<div class="v0745QuickRow">'+cardHTML(c,{select:true})+
        '<div><b style="font-size:9px">'+safeText(c.name)+'</b><div class="v0745CombatSub">この攻撃を無効にする</div>'+
        '<div class="v0745QuickBtns" style="margin-top:5px">'+
        '<button '+(standingSouls(G.p)<1?'disabled':'')+' onclick="event.stopPropagation();chooseInterrupt('+c.uid+',\'soul\')">1ソウル＋このカード</button>'+
        '<button '+(G.p.hand.length<2?'disabled':'')+' onclick="event.stopPropagation();chooseInterrupt('+c.uid+',\'discard\')">このカード＋手札1枚</button>'+
        '</div></div></div>'
      ).join('');
      return '<div class="modal v0745CombatModal"><div class="modalCard">'+
        '<div class="v0745CombatHead"><div><h2>割り込みを使いますか？</h2><div class="v0745CombatSub">相手ターンのバトル中。使うカードとコストを選択してください。</div></div></div>'+
        rows+'<div class="v0745CombatActions"><button class="v0745Skip" onclick="skipInterrupt()">使わない</button></div>'+
        '</div></div>';
    };
  }

  /* Player target tap: preserve rules, only capture coordinates and draw a brief attack arrow. */
  if(typeof clickEnemyTarget==='function'){
    const baseClickEnemyTarget=clickEnemyTarget;
    clickEnemyTarget=function(kind,uid){
      let a=null,b=null;
      try{
        const atk=G?.selected?G.p.pals.find(x=>x.uid===G.selected):null;
        a=centerOf(uidEl(atk?.uid));
        b=centerOf(kind==='player'?playerStackFor(G?.a):uidEl(uid));
      }catch(_e){}
      const r=baseClickEnemyTarget(kind,uid);
      drawArrowPoints(a,b);
      return r;
    };
  }

  /* CPU attack arrow. Player attacks are already animated by clickEnemyTarget. */
  if(typeof declareBattle==='function'){
    const baseDeclareBattle=declareBattle;
    declareBattle=function(attOwner,attUid,target,after){
      let a=null,b=null,isCpu=false;
      try{
        isCpu=(attOwner===G?.a)||!!attOwner?.isAI;
        if(isCpu){
          a=centerOf(uidEl(attUid));
          b=centerOf(targetEl(attOwner,target));
        }
      }catch(_e){}
      const r=baseDeclareBattle(attOwner,attUid,target,after);
      if(isCpu)drawArrowPoints(a,b);
      return r;
    };
  }

  if(typeof chooseBlock==='function'){
    const baseChooseBlock=chooseBlock;
    chooseBlock=function(uid){
      let a=null,b=null,name='';
      try{
        const c=uid&&pendingBlock?.blockers?.find(x=>x.uid===uid);
        if(c){a=centerOf(uidEl(c.uid));b=centerOf(uidEl(pendingBlock?.atk?.uid));name=c.name||''}
      }catch(_e){}
      const r=baseChooseBlock(uid);
      if(uid){drawArrowPoints(a,b);toast('<b>BLOCK</b> '+safeText(name))}
      else toast('ブロックしない');
      return r;
    };
  }

  if(typeof chooseInterrupt==='function'){
    const baseChooseInterrupt=chooseInterrupt;
    chooseInterrupt=function(uid,mode){
      let name='';try{name=pendingQuick?.ints?.find(x=>x.uid===uid)?.name||''}catch(_e){}
      const r=baseChooseInterrupt(uid,mode);
      toast('<b>INTERRUPT</b> '+safeText(name));
      return r;
    };
  }

  /* Battle result pop: informational only. No state is changed here. */
  if(typeof resolveBattle==='function'){
    const baseResolveBattleUX=resolveBattle;
    resolveBattle=function(attOwner,atk,target){
      let msg='';
      try{
        const def=typeof other==='function'?other(attOwner):null;
        if(target?.type==='player')msg='<b>STRIKE '+strikeOf(atk)+'</b> → '+safeText(def?.name||'PLAYER');
        else if(target?.type==='pal'){
          const tar=def?.pals?.find(x=>x.uid===target.uid);
          msg='<b>BATTLE</b> '+powerOf(atk)+' ↔ '+(tar?powerOf(tar):'?');
        }else if(target?.type==='structure')msg='<b>DAMAGE '+powerOf(atk)+'</b>';
      }catch(_e){}
      const r=baseResolveBattleUX(attOwner,atk,target);
      if(msg)toast(msg);
      return r;
    };
  }

  function applyCombatUX(){
    scheduled=false;
    try{
      const app=document.querySelector('.app.v04');
      if(app)app.classList.add('v0745CombatUX');
      const play=playRoot();
      if(!play)return;

      /* Robust CPU attack cue: some AI paths open pendingBlock without passing through declareBattle.
         Detect that state after render and draw the arrow above the compact reaction sheet. */
      try{
        if(globalThis.pendingBlock&&pendingBlock?.atk&&pendingBlock?.target){
          const sig=[pendingBlock.atk.uid,pendingBlock.target.type,pendingBlock.target.uid||'player',G?.turnSeq||''].join(':');
          if(sig!==lastPendingBattleSig){
            lastPendingBattleSig=sig;
            const owner=pendingBlock.attOwner||G?.a;
            setTimeout(()=>arrowBetween(owner,pendingBlock.atk,pendingBlock.target),60);
          }
        }else lastPendingBattleSig='';
      }catch(_e){}

      /* Compact generic target-selection sheets and long-press card details. */
      try{
        document.querySelectorAll('.modal:not(.v0745CombatModal)').forEach(m=>{
          const txt=(m.textContent||'').replace(/\s+/g,' ');
          const effectLike=/ダメージを与えるパル|対象.{0,8}パル|パルを選/i.test(txt);
          const cards=m.querySelectorAll('.card');
          const detailLike=!effectLike && cards.length===1 && /状態|REST|STAND|能力|COST|POWER|STRIKE|コスト/i.test(txt);
          m.classList.toggle('v0745EffectChoice',effectLike);
          m.classList.toggle('v0748CardDetail',detailLike);
        });
      }catch(_e){}

      let hint=play.querySelector('.v0745CombatHint');
      if(!hint){hint=document.createElement('div');hint.className='v0745CombatHint';play.appendChild(hint)}
      if(globalThis.G&&G?.selected){
        const atk=G.p?.pals?.find(x=>x.uid===G.selected);
        hint.textContent=(atk?.name?atk.name+'：':'')+'攻撃対象をタップ';
        hint.classList.add('show');
      }else{
        hint.classList.remove('show');
      }
    }catch(_e){}
  }
  function scheduleCombatUX(){
    if(scheduled)return;scheduled=true;requestAnimationFrame(applyCombatUX);
  }

  /* Run after every game render, without changing the render output/state. */
  if(typeof render==='function'){
    const baseRenderCombatUX=render;
    render=function(){const r=baseRenderCombatUX();scheduleCombatUX();return r};
  }

  /* v0.7.48: a long-press detail is a temporary preview, not a blocking modal.
     Release the press to close it. Tapping elsewhere also dismisses it after the
     underlying tap has been delivered, so hand play/select remains responsive. */
  function dismissCardDetailSoon(){
    setTimeout(()=>{
      try{
        if(!document.querySelector('.modal.v0748CardDetail'))return;
        if(typeof detailUid!=='undefined')detailUid=null;
        if(typeof render==='function')render();
        else document.querySelectorAll('.modal.v0748CardDetail').forEach(x=>x.remove());
      }catch(_e){}
    },0);
  }
  document.addEventListener('pointerup',ev=>{
    try{if(document.querySelector('.modal.v0748CardDetail'))dismissCardDetailSoon()}catch(_e){}
  },true);
  document.addEventListener('pointerdown',ev=>{
    try{
      const m=document.querySelector('.modal.v0748CardDetail');
      if(m&&!ev.target?.closest?.('.modal.v0748CardDetail>.modalCard'))dismissCardDetailSoon();
    }catch(_e){}
  },true);

  try{new MutationObserver(scheduleCombatUX).observe(document.documentElement,{childList:true,subtree:true})}catch(_e){}
  addEventListener('pageshow',applyCombatUX,{passive:true});
  addEventListener('resize',scheduleCombatUX,{passive:true});
  applyCombatUX();setTimeout(applyCombatUX,300);setTimeout(applyCombatUX,1100);
  console.info('Palworld OCG v0.7.54 combat UX stable applied');
})();
</script>


<style id="v0748SafeOverlayFix">
/* v0.7.48 stability recovery: compact only existing battle modals.
   No additional battle hooks or observers are installed here. */
.modal.v0745CombatModal{
  align-items:flex-end!important;
  justify-content:center!important;
  padding:3px!important;
}
.modal.v0745CombatModal>.modalCard{
  width:min(330px,66vw)!important;
  max-width:330px!important;
  max-height:30vh!important;
  overflow:auto!important;
  padding:4px!important;
  border-radius:10px!important;
}
.modal.v0745CombatModal .v0745CombatCards{gap:4px!important;padding:1px 0 2px!important}
.modal.v0745CombatModal .v0745CombatChoice{flex-basis:50px!important;padding:2px!important}
.modal.v0745CombatModal .v0745CombatChoice .card{height:49px!important;width:43px!important;min-width:43px!important}
.modal.v0745CombatModal .v0745CombatActions button{padding:4px 3px!important;font-size:6.5px!important}
@media(max-height:520px) and (orientation:landscape){
  .modal.v0745CombatModal>.modalCard{width:min(305px,62vw)!important;max-height:27vh!important}
}

/* v0.7.48: long-press card detail is a compact top preview.
   The lower hand remains visible and touchable. */
.modal.v0748CardDetail{
  position:fixed!important;inset:0!important;z-index:2147482350!important;
  align-items:flex-start!important;justify-content:center!important;
  padding:3px!important;background:#0004!important;backdrop-filter:none!important;
  pointer-events:none!important;
}
.modal.v0748CardDetail>.modalCard{
  pointer-events:auto!important;
  margin:2px auto 0!important;
  width:min(330px,58vw)!important;max-width:330px!important;
  max-height:46vh!important;overflow:auto!important;
  padding:5px!important;border-radius:10px!important;
  box-shadow:0 6px 18px #000b!important;
}
.modal.v0748CardDetail .card{
  width:86px!important;min-width:86px!important;max-width:86px!important;
  height:118px!important;max-height:118px!important;
}
.modal.v0748CardDetail h1,.modal.v0748CardDetail h2,.modal.v0748CardDetail h3{
  font-size:10px!important;line-height:1.15!important;margin:0 0 3px!important;
}
.modal.v0748CardDetail p,.modal.v0748CardDetail .muted,.modal.v0748CardDetail .small{
  font-size:6.5px!important;line-height:1.25!important;
}
@media(max-height:520px) and (orientation:landscape){
  .modal.v0748CardDetail>.modalCard{width:min(300px,54vw)!important;max-height:42vh!important;padding:4px!important}
  .modal.v0748CardDetail .card{width:76px!important;min-width:76px!important;max-width:76px!important;height:104px!important;max-height:104px!important}
}
</style>

<style id="v0750HandSummonUX">
/* v0.7.51 — hand / summon presentation retained from v0.7.50. */

/* The small version pill beside the start-screen title was hard to read on a phone. */
.modalCard h2 .badge.official,
.modalCard h3 .badge.official{
  font-size:10px!important;
  line-height:1.15!important;
  padding:2px 6px!important;
  margin-left:4px!important;
  border-radius:6px!important;
  vertical-align:middle!important;
  letter-spacing:.1px!important;
}

/* Keep the hand compact, but make each card easier to distinguish and touch. */
.app.v04.v0738CenterRifleFix .v04HandBar{
  height:98px!important;
  min-height:98px!important;
  padding:1px 4px 3px!important;
}
.app.v04.v0738CenterRifleFix .v04Hand{
  gap:4px!important;
  padding:7px 7px 2px!important;
  scroll-snap-type:x proximity;
  overscroll-behavior-x:contain;
}
.app.v04.v0738CenterRifleFix .v04Hand>.card{
  height:89px!important;
  width:67px!important;
  flex:0 0 67px!important;
  scroll-snap-align:center;
  transform-origin:center bottom;
  transition:transform .14s ease,box-shadow .14s ease,filter .14s ease,outline-color .14s ease!important;
}

/* Playable cards are subtly lifted, Master-Duel-like, without hiding neighbouring cards. */
.app.v04.v0738CenterRifleFix .v04Hand>.card.selectable{
  transform:translateY(-2px)!important;
  box-shadow:0 2px 7px #0009,0 0 0 1px #76d2a777 inset!important;
}
.app.v04.v0738CenterRifleFix .v04Hand>.card.v0750HandSelected{
  transform:translateY(-7px) scale(1.035)!important;
  outline:2px solid #ffe078!important;
  box-shadow:0 5px 12px #000c,0 0 15px #ffd85c99!important;
  filter:brightness(1.08) saturate(1.05)!important;
  z-index:16!important;
}

/* Newly drawn cards get a short, non-blocking visual cue. */
.app.v04.v0738CenterRifleFix .v04Hand>.card.v0750HandEnter{
  animation:v0750HandEnter .34s ease-out both!important;
}
@keyframes v0750HandEnter{
  0%{opacity:.28;filter:brightness(1.55) saturate(1.15)}
  55%{opacity:1;filter:brightness(1.18) saturate(1.08)}
  100%{opacity:1;filter:none}
}

/* Placement is the important step after selecting a summon: make valid zones unmistakable. */
.app.v04.v0738CenterRifleFix .zone.placementTarget{
  border:2px solid #ffde62!important;
  background:linear-gradient(180deg,#4b3d18cc,#80681a88)!important;
  box-shadow:0 0 0 2px #fff4 inset,0 0 20px #ffd84ebb!important;
  animation:v0750PlacementPulse .62s ease-in-out infinite alternate!important;
}
.app.v04.v0738CenterRifleFix .zone.placementTarget:after{
  content:"ここに登場"!important;
  font-size:9px!important;
  line-height:1.15!important;
  font-weight:950!important;
  color:#fff8d5!important;
  text-shadow:0 1px 3px #000,0 0 5px #9a6300!important;
}
@keyframes v0750PlacementPulse{
  from{filter:brightness(.94)}
  to{filter:brightness(1.2)}
}

/* Keep the placement instruction near the field, readable but not obstructive. */
.app.v04.v0738CenterRifleFix .v044PlacementBanner{
  top:4px!important;
  min-width:min(350px,62%)!important;
  max-width:72%!important;
  padding:5px 11px!important;
  border-width:1px!important;
  font-size:9px!important;
  line-height:1.25!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}

/* Summoned / deployed card flashes once after it appears on the field. */
.app.v04.v0738CenterRifleFix .v04Play .card.v0750SummonEnter{
  animation:v0750SummonEnter .48s ease-out both!important;
}
@keyframes v0750SummonEnter{
  0%{opacity:.3;filter:brightness(1.8) saturate(1.2);box-shadow:0 0 24px #ffe77dcc}
  45%{opacity:1;filter:brightness(1.25) saturate(1.1);box-shadow:0 0 18px #ffe77daa}
  100%{opacity:1;filter:none}
}

/* The use-confirmation sheet stays visible without swallowing the battlefield. */
.v044UseCard{
  width:min(390px,72vw)!important;
  max-height:62vh!important;
  padding:7px!important;
  border-radius:13px!important;
}
.v044UseGrid{
  grid-template-columns:minmax(88px,30%) minmax(0,1fr)!important;
  gap:8px!important;
}
.v044UseArt{height:min(36vh,220px)!important}
.v044UseTitle{font-size:14px!important;margin-bottom:3px!important}
.v044UseMeta{font-size:8px!important;margin-bottom:4px!important}
.v044UseQuestion{font-size:12px!important;margin:5px 0!important}
.v044UseEffect{font-size:7px!important;line-height:1.35!important;max-height:72px!important;padding:5px!important}
.v044UseButtons{gap:5px!important;margin-top:6px!important}
.v044UseButtons button{font-size:9px!important;padding:6px!important}

@media(max-height:520px) and (orientation:landscape){
  .modalCard h2 .badge.official,.modalCard h3 .badge.official{font-size:9px!important;padding:2px 5px!important}
  .app.v04.v0738CenterRifleFix .v04HandBar{height:94px!important;min-height:94px!important}
  .app.v04.v0738CenterRifleFix .v04Hand>.card{height:85px!important;width:64px!important;flex-basis:64px!important}
  .app.v04.v0738CenterRifleFix .v044PlacementBanner{font-size:8px!important;padding:4px 9px!important}
  .v044UseCard{width:min(350px,68vw)!important;max-height:58vh!important}
  .v044UseArt{height:min(32vh,180px)!important}
}
</style>

<script id="v0750HandSummonUXScript">
(()=>{
  if(globalThis.__v0750HandSummonUXApplied)return;
  globalThis.__v0750HandSummonUXApplied=true;

  let scheduled=false;
  let knownHand=null;
  let knownField=null;

  const uidSet=els=>new Set(els.map(el=>String(el.dataset.uid||'' )).filter(Boolean));

  function clearTransient(el,cls,ms){
    try{el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),ms)}catch(_e){}
  }

  function sync(){
    scheduled=false;
    try{
      const app=document.querySelector('.app.v04');
      if(!app){knownHand=null;knownField=null;return}
      app.classList.add('v0750HandSummonUX');

      const handEls=[...document.querySelectorAll('.v04Hand>.card[data-uid]')];
      const handNow=uidSet(handEls);

      /* Visualise the selected hand card when the current upstream exposes its selection uid. */
      let selected=null;
      try{if(typeof v0725SelectedHandUid!=='undefined'&&v0725SelectedHandUid!=null)selected=String(v0725SelectedHandUid)}catch(_e){}
      handEls.forEach(el=>el.classList.toggle('v0750HandSelected',selected!=null&&String(el.dataset.uid)===selected));

      if(knownHand!==null){
        handEls.forEach(el=>{
          const id=String(el.dataset.uid||'');
          if(id&&!knownHand.has(id))clearTransient(el,'v0750HandEnter',380);
        });
      }
      knownHand=handNow;

      /* Track board UIDs, not DOM nodes, because the upstream render replaces the board each render. */
      const fieldEls=[...document.querySelectorAll(
        '.v04Play .palrow .card[data-uid],.v04Play .supportrow .card[data-uid]'
      )];
      const fieldNow=uidSet(fieldEls);
      if(knownField!==null){
        fieldEls.forEach(el=>{
          const id=String(el.dataset.uid||'');
          if(id&&!knownField.has(id))clearTransient(el,'v0750SummonEnter',520);
        });
      }
      knownField=fieldNow;
    }catch(_e){}
  }

  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(sync);
  }

  try{new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true})}catch(_e){}
  addEventListener('pageshow',sync,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
  sync();
  setTimeout(sync,250);
  setTimeout(sync,900);
  console.info('Palworld OCG v0.7.54 hand/summon presentation applied');
})();
</script>

<style id="v0750HandSummonMotion">
/* v0.7.51 — visual-only hand / summon motion polish retained from v0.7.50.
   No rule, cost, target, damage, draw-count or summon-resolution logic is changed. */

/* Version pill: one more step up in readability without overpowering the title. */
.badge.official{
  font-size:11px!important;
  line-height:1.15!important;
  padding:2px 7px!important;
  border-radius:7px!important;
  letter-spacing:.15px!important;
}

/* Slight hand overlap gives a held-hand feel while keeping every card touchable. */
.app.v04.v0738CenterRifleFix .v04Hand>.card{
  margin-left:-2px!important;
  will-change:transform,filter,box-shadow,opacity;
}
.app.v04.v0738CenterRifleFix .v04Hand>.card:first-child{margin-left:0!important}
.app.v04.v0738CenterRifleFix .v04Hand>.card.v0750HandSelected{
  transform:translateY(-9px) scale(1.055)!important;
  z-index:24!important;
}
.app.v04.v0738CenterRifleFix .v04Hand>.card.v0750HandPress{
  transform:translateY(-5px) scale(1.025)!important;
  filter:brightness(1.12)!important;
}

/* Drawn cards rise into the hand instead of only flashing. */
@keyframes v0750HandEnter{
  0%{opacity:.12;transform:translateY(18px) scale(.84);filter:brightness(1.65) saturate(1.18)}
  58%{opacity:1;transform:translateY(-2px) scale(1.025);filter:brightness(1.18) saturate(1.08)}
  100%{opacity:1;transform:none;filter:none}
}

/* Flying visual clone used only while a hand card moves to the battlefield. */
.v0750SummonGhost{
  position:fixed!important;
  z-index:2147483300!important;
  pointer-events:none!important;
  margin:0!important;
  transform-origin:center center!important;
  overflow:hidden!important;
  border-radius:6px!important;
  box-shadow:0 4px 16px #000c,0 0 18px #ffe17699!important;
  will-change:left,top,width,height,transform,opacity,filter!important;
}
.v0750SummonLanding{
  animation:v0750SummonLanding .52s ease-out both!important;
  position:relative!important;
  z-index:18!important;
}
@keyframes v0750SummonLanding{
  0%{transform:scale(.82);filter:brightness(1.7) saturate(1.25);box-shadow:0 0 28px #ffe47dcc}
  52%{transform:scale(1.06);filter:brightness(1.2) saturate(1.1);box-shadow:0 0 18px #ffe47daa}
  100%{transform:none;filter:none;box-shadow:none}
}

/* Make the valid placement slots read like a clear destination, not just a border. */
.app.v04.v0738CenterRifleFix .zone.placementTarget{
  box-shadow:0 0 0 2px #fff5 inset,0 0 25px #ffd84ed0!important;
}
.app.v04.v0738CenterRifleFix .zone.placementTarget:after{
  font-size:10px!important;
  letter-spacing:.25px!important;
}

@media(max-height:520px) and (orientation:landscape){
  .badge.official{font-size:10px!important;padding:2px 6px!important}
  .app.v04.v0738CenterRifleFix .v04Hand>.card{margin-left:-1px!important}
  .app.v04.v0738CenterRifleFix .v04Hand>.card.v0750HandSelected{transform:translateY(-7px) scale(1.045)!important}
}
</style>

<script id="v0750HandSummonMotionScript">
(()=>{
  if(globalThis.__v0750HandSummonMotionApplied)return;
  globalThis.__v0750HandSummonMotionApplied=true;

  let scheduled=false;
  let knownField=null;
  let handSnapshots=new Map();
  const uid=el=>String((el&&el.dataset&&el.dataset.uid)||'');

  function snapshotHand(){
    const map=new Map();
    document.querySelectorAll('.v04Hand>.card[data-uid]').forEach(el=>{
      try{
        const id=uid(el); if(!id)return;
        const r=el.getBoundingClientRect();
        map.set(id,{left:r.left,top:r.top,width:r.width,height:r.height,html:el.outerHTML});
      }catch(_e){}
    });
    return map;
  }

  function fieldCards(){
    return [...document.querySelectorAll('.v04Play .palrow .card[data-uid],.v04Play .supportrow .card[data-uid]')];
  }

  function flyFromHand(snap,dest){
    try{
      const dr=dest.getBoundingClientRect();
      if(!snap||!dr.width||!dr.height)return;
      const wrap=document.createElement('div');
      wrap.innerHTML=snap.html;
      const ghost=wrap.firstElementChild;
      if(!ghost)return;
      ghost.removeAttribute('onclick');
      ghost.querySelectorAll('[onclick]').forEach(x=>x.removeAttribute('onclick'));
      ghost.classList.add('v0750SummonGhost');
      Object.assign(ghost.style,{left:snap.left+'px',top:snap.top+'px',width:snap.width+'px',height:snap.height+'px'});
      document.body.appendChild(ghost);

      const sx=snap.left, sy=snap.top, sw=snap.width, sh=snap.height;
      const dx=dr.left, dy=dr.top, dw=dr.width, dh=dr.height;
      const mx=(sx+dx)/2, my=Math.min(sy,dy)-Math.max(14,Math.abs(dy-sy)*.12);
      const keyframes=[
        {left:sx+'px',top:sy+'px',width:sw+'px',height:sh+'px',opacity:.96,transform:'scale(1) rotate(0deg)',filter:'brightness(1)'},
        {offset:.55,left:mx+'px',top:my+'px',width:((sw+dw)/2)+'px',height:((sh+dh)/2)+'px',opacity:1,transform:'scale(1.12) rotate(-1.5deg)',filter:'brightness(1.28) saturate(1.12)'},
        {left:dx+'px',top:dy+'px',width:dw+'px',height:dh+'px',opacity:.92,transform:'scale(1) rotate(0deg)',filter:'brightness(1.12)'}
      ];
      const anim=ghost.animate(keyframes,{duration:430,easing:'cubic-bezier(.18,.82,.22,1)',fill:'forwards'});
      const finish=()=>{
        try{ghost.remove()}catch(_e){}
        try{dest.classList.remove('v0750SummonLanding');void dest.offsetWidth;dest.classList.add('v0750SummonLanding');setTimeout(()=>dest.classList.remove('v0750SummonLanding'),560)}catch(_e){}
      };
      anim.onfinish=finish; anim.oncancel=finish;
      setTimeout(()=>{if(ghost.isConnected)finish()},540);
    }catch(_e){}
  }

  function sync(){
    scheduled=false;
    try{
      const app=document.querySelector('.app.v04');
      if(!app){knownField=null;handSnapshots=new Map();return}

      const prevHand=handSnapshots;
      const fields=fieldCards();
      const nowField=new Set(fields.map(uid).filter(Boolean));
      if(knownField!==null){
        fields.forEach(el=>{
          const id=uid(el);
          if(id&&!knownField.has(id)&&prevHand.has(id))flyFromHand(prevHand.get(id),el);
        });
      }
      knownField=nowField;
      handSnapshots=snapshotHand();
    }catch(_e){}
  }

  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>requestAnimationFrame(sync));
  }

  document.addEventListener('pointerdown',ev=>{
    const el=ev.target.closest&&ev.target.closest('.v04Hand>.card[data-uid]');
    if(!el||ev.target.closest('.actBtn,.infoBtn'))return;
    el.classList.add('v0750HandPress');
  },{passive:true});
  ['pointerup','pointercancel'].forEach(type=>document.addEventListener(type,()=>{
    document.querySelectorAll('.v0750HandPress').forEach(el=>el.classList.remove('v0750HandPress'));
  },{passive:true}));

  try{new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true})}catch(_e){}
  addEventListener('pageshow',sync,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  sync(); setTimeout(sync,250); setTimeout(sync,900);
  console.info('Palworld OCG v0.7.54 hand/summon motion polish applied');
})();
</script>

<style id="v0751PlacementStructureAttackFix">
/* v0.7.51 — explicit deployment-slot choice + legal Structure attack targeting. */
.app.v04.v0738CenterRifleFix .zone.v0751PlacementChoice{
  position:relative!important;
  cursor:pointer!important;
  border:2px solid #ffe16a!important;
  background:linear-gradient(180deg,#584d1ed6,#2e2812d6)!important;
  box-shadow:0 0 0 2px #fff5 inset,0 0 30px #ffd84ee8!important;
  animation:v0751SlotPulse .62s ease-in-out infinite alternate!important;
}
.app.v04.v0738CenterRifleFix .zone.v0751PlacementChoice:after{
  content:"ここに登場"!important;
  position:absolute!important;
  inset:auto 2px 3px!important;
  display:block!important;
  text-align:center!important;
  font-size:10px!important;
  line-height:1.1!important;
  font-weight:950!important;
  color:#fff!important;
  text-shadow:0 1px 4px #000!important;
  pointer-events:none!important;
}
.app.v04.v0738CenterRifleFix .zone.v0751StructureTarget{
  border:2px solid #ffbd55!important;
  box-shadow:0 0 0 2px #fff4 inset,0 0 24px #ff9f43cc!important;
  cursor:pointer!important;
  animation:v0751TargetPulse .62s ease-in-out infinite alternate!important;
}
.app.v04.v0738CenterRifleFix .zone.v0751StructureTarget:before{
  content:"攻撃可能";
  position:absolute;
  z-index:7;
  top:2px;
  left:50%;
  transform:translateX(-50%);
  padding:1px 4px;
  border-radius:999px;
  background:#7b351be8;
  color:#fff4d6;
  font-size:8px;
  font-weight:950;
  white-space:nowrap;
  pointer-events:none;
}
@keyframes v0751SlotPulse{from{filter:brightness(.92)}to{filter:brightness(1.25)}}
@keyframes v0751TargetPulse{from{filter:brightness(.96)}to{filter:brightness(1.18)}}
</style>

<script id="v0751PlacementStructureAttackScript">
(()=>{
  if(globalThis.__v0751PlacementStructureAttackApplied)return;
  globalThis.__v0751PlacementStructureAttackApplied=true;
  let scheduled=false;

  function isPermanent(c){return !!c&&['Pal','Structure','Gear'].includes(String(c.kind||''))}

  /* Route the local player's permanent cards through the confirm -> placement flow.
     CPU / remote resolution paths are left alone. */
  try{
    if(typeof playFromHand==='function'&&!playFromHand.__v0751Wrapped){
      const basePlayFromHand=playFromHand;
      const wrapped=function(pl,uid){
        try{
          const c=pl&&pl.hand&&pl.hand.find(x=>Number(x.uid)===Number(uid));
          if(typeof G!=='undefined'&&G&&pl===G.p&&!pl.isAI&&G.turn==='p'&&G.phase==='MAIN'&&isPermanent(c)&&typeof requestPlayFromHand==='function'){
            return requestPlayFromHand(Number(uid));
          }
        }catch(_e){}
        return basePlayFromHand(pl,uid);
      };
      wrapped.__v0751Wrapped=true;
      playFromHand=wrapped;
    }
  }catch(_e){}

  function patchTryPlay(){
    try{
      if(typeof v0725TryPlay!=='function'||v0725TryPlay.__v0751Wrapped)return;
      const base=v0725TryPlay;
      const wrapped=function(uid){
        try{
          const c=G&&G.p&&G.p.hand&&G.p.hand.find(x=>Number(x.uid)===Number(uid));
          if(isPermanent(c)&&typeof requestPlayFromHand==='function')return requestPlayFromHand(Number(uid));
        }catch(_e){}
        return base(uid);
      };
      wrapped.__v0751Wrapped=true;
      v0725TryPlay=wrapped;
    }catch(_e){}
  }

  /* Comprehensive rules: a Structure itself is a legal attack target regardless of Rest/Stand.
     Pal legality remains delegated to the existing engine, including Taunt / Assault restrictions. */
  try{
    if(typeof canBeAttacked==='function'&&!canBeAttacked.__v0751Wrapped){
      const baseCanBeAttacked=canBeAttacked;
      const wrapped=function(atk,target){
        if(target&&String(target.kind||'')==='Structure')return true;
        return baseCanBeAttacked(atk,target);
      };
      wrapped.__v0751Wrapped=true;
      canBeAttacked=wrapped;
    }
  }catch(_e){}

  function ownSide(){return document.querySelector('.v04Play .side.player')||document.querySelector('.v04Play .player.side')}
  function enemySide(){return document.querySelector('.v04Play .side.enemy')||document.querySelector('.v04Play .enemy.side')}

  function addChoice(zone,slot){
    if(!zone)return;
    zone.classList.add('placementTarget','v0751PlacementChoice');
    zone.dataset.v0751PlacementSlot=String(slot);
    zone.onclick=function(ev){
      try{ev.preventDefault();ev.stopPropagation()}catch(_e){}
      try{if(typeof confirmPlacement==='function')confirmPlacement(slot)}catch(_e){}
    };
  }

  function ensurePlacementChoices(){
    try{
      if(typeof pendingPlacement==='undefined'||!pendingPlacement)return;
      const side=ownSide();if(!side)return;
      const kind=String(pendingPlacement.kind||'');
      if(kind==='Pal'){
        const row=side.querySelector('.palrow');if(!row)return;
        const zones=[...row.children].filter(x=>x.classList&&x.classList.contains('zone'));
        for(let i=0;i<5;i++){
          let z=zones[i];
          if(!z){z=document.createElement('div');z.className='zone';z.textContent='PAL';row.appendChild(z)}
          if(!z.querySelector('.card'))addChoice(z,i);
        }
      }else if(kind==='Structure'||kind==='Gear'){
        const row=side.querySelector('.supportrow');if(!row)return;
        let zones=[...row.children].filter(x=>x.classList&&x.classList.contains('zone'));
        zones.forEach((z,i)=>{if(!z.querySelector('.card'))addChoice(z,i)});
        /* Structures / Gear have no published base-count cap; always expose one extra selectable slot. */
        if(!zones.some(z=>!z.querySelector('.card'))){
          const slot=zones.length;
          const z=document.createElement('div');z.className='zone';z.textContent='BUILD / GEAR';row.appendChild(z);addChoice(z,slot);
        }
      }
    }catch(_e){}
  }

  function reinforceStructureTargets(){
    try{
      if(typeof G==='undefined'||!G||!G.selected||G.turn!=='p'||G.phase!=='MAIN')return;
      const atk=G.p&&G.p.pals&&G.p.pals.find(x=>Number(x.uid)===Number(G.selected));
      if(!atk)return;
      const side=enemySide();if(!side)return;
      side.querySelectorAll('.supportrow .zone').forEach(z=>{
        const cardEl=z.querySelector('.card[data-uid]');if(!cardEl)return;
        const id=Number(cardEl.dataset.uid);
        const c=G.a&&G.a.supports&&G.a.supports.find(x=>Number(x.uid)===id);
        if(!c||String(c.kind||'')!=='Structure')return;
        let legal=true;
        try{if(typeof canAttackCard==='function')legal=!!canAttackCard(atk,c,G.a)}catch(_e){}
        if(!legal)return;
        z.classList.add('validTarget','v0751StructureTarget');
        cardEl.classList.add('selectable');
        cardEl.onclick=function(ev){
          try{ev.preventDefault();ev.stopPropagation()}catch(_e){}
          try{if(typeof clickEnemyTarget==='function')clickEnemyTarget('structure',id)}catch(_e){}
        };
      });
    }catch(_e){}
  }

  function syncCopy(){
    try{
      document.querySelectorAll('.v04Play .mid').forEach(el=>{
        const t=String(el.textContent||'');
        if(t.includes('REST中のパル・建築物'))el.textContent=t.replace('REST中のパル・建築物','REST中のパル / 建築物');
        else if(t.includes('レスト中のパル・建築物'))el.textContent=t.replace('レスト中のパル・建築物','レスト中のパル / 建築物');
      });
    }catch(_e){}
  }

  function sync(){
    scheduled=false;
    patchTryPlay();
    ensurePlacementChoices();
    reinforceStructureTargets();
    syncCopy();
  }
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(sync)}
  try{new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true})}catch(_e){}
  addEventListener('pageshow',sync,{passive:true});
  document.addEventListener('pointerup',schedule,{passive:true});
  sync();setTimeout(sync,250);setTimeout(sync,900);
  console.info('Palworld OCG v0.7.54 placement selection + Structure attack fix applied');
})();
</script>

<style id="v0754FullscreenCardDetailStyle">
/* v0.7.54 — tap the compact left-side detail panel to inspect the selected card full-screen. */
.app.v04.v0738CenterRifleFix .v04Detail{
  cursor:zoom-in!important;
  position:relative!important;
  touch-action:manipulation!important;
}
.app.v04.v0738CenterRifleFix .v04Detail:after{
  content:"タップで全画面";
  position:absolute;
  right:3px;
  bottom:3px;
  z-index:8;
  padding:2px 4px;
  border-radius:6px;
  background:#000b;
  border:1px solid #ffffff33;
  color:#eafff3;
  font-size:5.5px;
  font-weight:900;
  line-height:1;
  pointer-events:none;
}
.v0754FullDetailOverlay{
  position:fixed!important;
  inset:0!important;
  z-index:2147483600!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  padding:10px!important;
  background:rgba(0,8,6,.94)!important;
  backdrop-filter:blur(5px)!important;
}
.v0754FullDetailPanel{
  position:relative!important;
  width:min(1180px,96vw)!important;
  height:min(680px,94dvh)!important;
  min-height:0!important;
  overflow:hidden!important;
  border:2px solid #7ecfa5!important;
  border-radius:18px!important;
  background:linear-gradient(160deg,#102a22,#07150f 70%)!important;
  box-shadow:0 18px 70px #000!important;
  padding:14px!important;
}
.v0754FullDetailClose{
  position:absolute!important;
  top:8px!important;
  right:8px!important;
  z-index:20!important;
  width:44px!important;
  height:44px!important;
  border-radius:50%!important;
  border:1px solid #ffffff55!important;
  background:#07110eee!important;
  color:#fff!important;
  font-size:28px!important;
  font-weight:900!important;
  line-height:1!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  padding:0!important;
}
.v0754FullDetailBody{
  width:100%!important;
  height:100%!important;
  min-height:0!important;
  display:grid!important;
  grid-template-columns:minmax(220px,42%) minmax(0,1fr)!important;
  grid-template-rows:auto minmax(0,1fr)!important;
  gap:12px!important;
  padding:2px 52px 2px 2px!important;
}
.v0754FullDetailBody>div:first-child{
  grid-column:1 / -1!important;
  min-width:0!important;
  padding-right:4px!important;
}
.v0754FullDetailBody>.v04BigCard{
  grid-column:1!important;
  grid-row:2!important;
  width:100%!important;
  height:100%!important;
  min-height:0!important;
  border-radius:14px!important;
  border-width:2px!important;
}
.v0754FullDetailBody>div:last-child{
  grid-column:2!important;
  grid-row:2!important;
  min-width:0!important;
  min-height:0!important;
  display:flex!important;
  flex-direction:column!important;
  gap:8px!important;
}
.v0754FullDetailBody .v04DetailHead{
  font-size:clamp(16px,2.3vw,28px)!important;
  line-height:1.15!important;
  white-space:normal!important;
  overflow:visible!important;
}
.v0754FullDetailBody .v04DetailMeta{
  font-size:clamp(10px,1.4vw,16px)!important;
  margin-top:4px!important;
}
.v0754FullDetailBody .v04BigOverlay{
  padding:12px!important;
}
.v0754FullDetailBody .v04BigName{
  font-size:clamp(14px,2vw,24px)!important;
  max-height:none!important;
  overflow:visible!important;
  margin-bottom:8px!important;
}
.v0754FullDetailBody .v04Stats{
  gap:7px!important;
}
.v0754FullDetailBody .v04Stat{
  font-size:clamp(10px,1.35vw,16px)!important;
  padding:4px 7px!important;
}
.v0754FullDetailBody .v04Effect{
  display:block!important;
  flex:1 1 auto!important;
  max-height:none!important;
  min-height:0!important;
  overflow:auto!important;
  padding:14px!important;
  font-size:clamp(12px,1.65vw,20px)!important;
  line-height:1.55!important;
  border-radius:12px!important;
  border-color:#5c9b7e!important;
  background:#06130fee!important;
}
.v0754FullDetailBody .v04ImgNote{
  font-size:clamp(9px,1.1vw,13px)!important;
  opacity:.78!important;
}
@media(max-height:520px) and (orientation:landscape){
  .v0754FullDetailOverlay{padding:4px!important}
  .v0754FullDetailPanel{width:98vw!important;height:96dvh!important;padding:7px!important;border-radius:12px!important}
  .v0754FullDetailClose{top:4px!important;right:4px!important;width:36px!important;height:36px!important;font-size:23px!important}
  .v0754FullDetailBody{grid-template-columns:minmax(180px,39%) minmax(0,1fr)!important;gap:7px!important;padding-right:41px!important}
  .v0754FullDetailBody .v04Effect{padding:8px!important;font-size:11px!important;line-height:1.4!important}
  .v0754FullDetailBody .v04BigOverlay{padding:7px!important}
  .v0754FullDetailBody .v04BigName{font-size:13px!important;margin-bottom:4px!important}
  .v0754FullDetailBody .v04Stat{font-size:9px!important;padding:2px 4px!important}
}
</style>
<script id="v0754FullscreenCardDetailScript">
(()=>{
  if(globalThis.__v0754FullscreenCardDetailApplied)return;
  globalThis.__v0754FullscreenCardDetailApplied=true;

  function closeFullDetail(){
    const old=document.getElementById('v0754FullDetailOverlay');
    if(old)old.remove();
  }

  function openFullDetail(){
    const src=document.getElementById('v04Detail');
    if(!src)return;
    if(!src.querySelector('.v04DetailMeta')){
      try{if(typeof toast==='function')toast('先にカードをタップしてください')}catch(_e){}
      return;
    }
    closeFullDetail();
    const overlay=document.createElement('div');
    overlay.id='v0754FullDetailOverlay';
    overlay.className='v0754FullDetailOverlay';
    const panel=document.createElement('div');
    panel.className='v0754FullDetailPanel';
    const close=document.createElement('button');
    close.type='button';
    close.className='v0754FullDetailClose';
    close.setAttribute('aria-label','カード詳細を閉じる');
    close.textContent='×';
    const body=document.createElement('div');
    body.className='v0754FullDetailBody';
    body.innerHTML=src.innerHTML;
    panel.appendChild(close);
    panel.appendChild(body);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    close.addEventListener('click',function(ev){ev.stopPropagation();closeFullDetail()});
    overlay.addEventListener('click',function(ev){if(ev.target===overlay)closeFullDetail()});
  }

  document.addEventListener('click',function(ev){
    const d=ev.target&&ev.target.closest?ev.target.closest('#v04Detail'):null;
    if(!d)return;
    ev.preventDefault();
    ev.stopPropagation();
    openFullDetail();
  },true);

  document.addEventListener('keydown',function(ev){if(ev.key==='Escape')closeFullDetail()});
  addEventListener('pageshow',closeFullDetail,{passive:true});
  console.info('Palworld OCG v0.7.54 fullscreen card detail applied');
})();
</script>


<style id="v0754CompactDecisionUXStyle">
/* v0.7.54 — keep battle decisions readable without hiding most of the board. */
.modal.v0754ChoiceSheet{
  position:fixed!important;inset:0!important;z-index:2147482450!important;
  align-items:flex-end!important;justify-content:center!important;
  padding:4px!important;background:#0005!important;backdrop-filter:blur(1px)!important;
}
.modal.v0754ChoiceSheet>.modalCard{
  width:min(560px,80vw)!important;max-width:560px!important;
  max-height:min(44dvh,260px)!important;min-height:0!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;
  padding:6px!important;border-radius:14px 14px 8px 8px!important;
  border:1px solid #4f8b70!important;background:#071711f4!important;
  box-shadow:0 -8px 26px #000c!important;
}
.modal.v0754ChoiceSheet>.modalCard>h2{
  margin:0 0 4px!important;font-size:10px!important;line-height:1.2!important;
  white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
}
.modal.v0754ChoiceSheet .choiceGrid{
  display:flex!important;grid-template-columns:none!important;
  gap:5px!important;overflow-x:auto!important;overflow-y:hidden!important;
  align-items:flex-start!important;padding:1px 1px 4px!important;flex:1 1 auto!important;min-height:0!important;
  scroll-snap-type:x proximity;
}
.modal.v0754ChoiceSheet .choiceGrid>div{
  flex:0 0 64px!important;min-width:64px!important;scroll-snap-align:start;
}
.modal.v0754ChoiceSheet .choiceGrid .card{
  width:62px!important;min-width:62px!important;max-width:62px!important;
  height:78px!important;min-height:78px!important;max-height:78px!important;
  margin:0!important;
}
.modal.v0754ChoiceSheet .choiceGrid .card .name{font-size:5.5px!important;line-height:1.05!important}
.modal.v0754ChoiceSheet .choiceGrid .card .stats,
.modal.v0754ChoiceSheet .choiceGrid .card .no{font-size:5px!important;line-height:1!important}
.modal.v0754ChoiceSheet .choices{
  margin-top:4px!important;display:flex!important;gap:5px!important;justify-content:flex-end!important;flex:0 0 auto!important;position:sticky!important;bottom:0!important;z-index:4!important;padding:4px 2px max(6px,env(safe-area-inset-bottom))!important;background:#071711f8!important;
}
.modal.v0754ChoiceSheet .choices button{
  width:auto!important;min-width:74px!important;padding:4px 8px!important;
  font-size:7px!important;line-height:1.1!important;border-radius:8px!important;
}

/* DAMAGE CHECK remains visible, but only as a slim board strip. */
.v0754DamageCheckPanel{
  min-height:0!important;max-height:58px!important;height:auto!important;
  overflow:auto!important;padding:3px 7px!important;margin:1px 0!important;
  border-radius:8px!important;
}
.v0754DamageCheckPanel h1,.v0754DamageCheckPanel h2,.v0754DamageCheckPanel h3,
.v0754DamageCheckPanel strong,.v0754DamageCheckPanel b{
  font-size:8px!important;line-height:1.05!important;margin:0!important;
}
.v0754DamageCheckPanel p,.v0754DamageCheckPanel div,.v0754DamageCheckPanel span{
  line-height:1.08!important;
}
.v0754DamageCheckPanel .card{
  width:52px!important;min-width:52px!important;max-width:52px!important;
  height:42px!important;min-height:42px!important;max-height:42px!important;
}
.v0754DamageCheckPanel button{
  padding:3px 7px!important;font-size:7px!important;line-height:1.05!important;
  min-height:0!important;border-radius:7px!important;
}

@media(max-height:520px) and (orientation:landscape){
  .modal.v0754ChoiceSheet>.modalCard{width:min(520px,76vw)!important;max-height:min(46dvh,235px)!important;padding:4px!important}
  .modal.v0754ChoiceSheet .choiceGrid>div{flex-basis:58px!important;min-width:58px!important}
  .modal.v0754ChoiceSheet .choiceGrid .card{width:56px!important;min-width:56px!important;max-width:56px!important;height:70px!important;min-height:70px!important;max-height:70px!important}
  .v0754DamageCheckPanel{max-height:50px!important;padding:2px 5px!important}
}
</style>
<script id="v0754CompactDecisionUXScript">
(()=>{
  if(globalThis.__v0754CompactDecisionUXApplied)return;
  globalThis.__v0754CompactDecisionUXApplied=true;
  let queued=false;

  function markChoiceSheets(){
    try{
      document.querySelectorAll('.modal:not(.v0745CombatModal)').forEach(function(m){
        if(m.id==='v0754FullDetailOverlay'||m.classList.contains('v0754FullDetailOverlay'))return;
        var grid=m.querySelector('.choiceGrid');
        if(!grid)return;
        if(m.querySelector('.detailLayout')||m.classList.contains('v0748CardDetail'))return;
        m.classList.add('v0754ChoiceSheet');
      });
    }catch(_e){}
  }

  function markDamageCheck(){
    try{
      var play=document.querySelector('.v04Play');
      if(!play)return;
      play.querySelectorAll('.v0754DamageCheckPanel').forEach(function(x){
        if(String(x.textContent||'').toUpperCase().indexOf('DAMAGE CHECK')<0)x.classList.remove('v0754DamageCheckPanel');
      });
      var nodes=play.querySelectorAll('div,section,aside,main');
      for(var i=0;i<nodes.length;i++){
        var el=nodes[i];
        var text=String(el.textContent||'').replace(/\s+/g,' ').trim().toUpperCase();
        if(text.indexOf('DAMAGE CHECK')<0)continue;
        var r=el.getBoundingClientRect();
        if(!r.width||!r.height)continue;
        if(r.width<play.getBoundingClientRect().width*.38)continue;
        if(r.height<32||r.height>play.getBoundingClientRect().height*.48)continue;
        var childHas=false;
        for(var j=0;j<el.children.length;j++){
          var c=el.children[j];
          if(String(c.textContent||'').toUpperCase().indexOf('DAMAGE CHECK')>=0){
            var cr=c.getBoundingClientRect();
            if(cr.width>=play.getBoundingClientRect().width*.38&&cr.height>=32){childHas=true;break;}
          }
        }
        if(!childHas){el.classList.add('v0754DamageCheckPanel');break;}
      }
    }catch(_e){}
  }

  function sync(){queued=false;markChoiceSheets();markDamageCheck()}
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(sync)}
  try{new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true})}catch(_e){}
  document.addEventListener('pointerup',schedule,{passive:true});
  addEventListener('pageshow',sync,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  sync();setTimeout(sync,250);setTimeout(sync,900);
  console.info('Palworld OCG v0.7.54 compact DAMAGE CHECK + effect-choice UI applied');
})();
</script>

<style id="v0754AssignClarityStyle">
/* v0.7.54 — make Pal -> Structure assignment unmistakable on the board. */
.board .card.v0754AssignedPal,
.v04Play .card.v0754AssignedPal{
  position:relative!important;
  outline:3px solid #ffe66d!important;
  box-shadow:0 0 0 2px #15251d,0 0 15px #ffe66dcc!important;
  z-index:8!important;
}
.board .card.v0754AssignedStructure,
.v04Play .card.v0754AssignedStructure{
  position:relative!important;
  outline:3px solid #ffe66d!important;
  box-shadow:0 0 0 2px #15251d,0 0 15px #ffe66dcc!important;
  z-index:8!important;
}
.v0754AssignBadge{
  position:absolute!important;
  left:3px!important;top:3px!important;transform:none!important;
  max-width:calc(100% - 6px)!important;padding:2px 4px!important;border-radius:6px!important;
  background:#ffe66d!important;color:#15170f!important;border:1px solid #fff7b5!important;
  font-size:6px!important;line-height:1.05!important;font-weight:1000!important;
  white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
  pointer-events:none!important;z-index:40!important;box-shadow:0 2px 6px #000b!important;
}
.v0754AssignBadge.v0754OnStructure{top:auto!important;bottom:3px!important}
.v0754AssignToast{
  position:fixed!important;left:50%!important;top:10%!important;transform:translateX(-50%)!important;
  z-index:2147483000!important;max-width:min(680px,82vw)!important;
  padding:6px 12px!important;border-radius:999px!important;
  background:#171a12f2!important;color:#fff5a8!important;border:2px solid #ffe66d!important;
  box-shadow:0 8px 26px #000d,0 0 22px #ffe66d55!important;
  font-size:10px!important;line-height:1.2!important;font-weight:1000!important;
  text-align:center!important;pointer-events:none!important;
  animation:v0754AssignToastIn .18s ease-out both;
}
@keyframes v0754AssignToastIn{from{opacity:0;transform:translate(-50%,-6px) scale(.97)}to{opacity:1;transform:translate(-50%,0) scale(1)}}
@media(max-height:520px) and (orientation:landscape){
  .v0754AssignBadge{font-size:5.5px!important;top:2px!important;left:2px!important;padding:2px 3px!important;max-width:calc(100% - 4px)!important}
  .v0754AssignBadge.v0754OnStructure{top:auto!important;bottom:2px!important}
  .v0754AssignToast{top:7%!important;font-size:8px!important;padding:4px 9px!important}
}
</style>
<script id="v0754AssignClarityScript">
(()=>{
  if(globalThis.__v0754AssignClarityApplied)return;
  globalThis.__v0754AssignClarityApplied=true;
  let queued=false,toastTimer=0;

  function escText(v){return String(v==null?'':v).replace(/[&<>\"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]||m})}
  function showAssignToast(palName,sourceName){
    try{
      document.querySelectorAll('.v0754AssignToast').forEach(function(x){x.remove()});
      const t=document.createElement('div');t.className='v0754AssignToast';
      t.textContent='ASSIGN  '+String(palName||'パル')+'  →  '+String(sourceName||'建築物');
      document.body.appendChild(t);
      clearTimeout(toastTimer);toastTimer=setTimeout(function(){try{t.remove()}catch(_e){}},1500);
    }catch(_e){}
  }

  /* Track the exact Pal used to pay an Assign cost. The rules still use the
     existing rest state; these fields are display-only and are cleared when
     that player's next Stand phase begins. */
  try{
    if(typeof chooseAssign==='function'&&!chooseAssign.__v0754Wrapped){
      chooseAssign=function(pl,source,cb){
        const cand=assignCandidates(pl);if(!cand.length)return;
        chooseTarget(pl,'アサインするスタンド状態のパル',wrappers(cand),function(x){return -aiCardScore(x.card)},function(x){
          if(!x)return;
          x.card.rest=true;
          x.card._v0754AssignedToUid=source&&source.uid;
          x.card._v0754AssignedToName=source&&source.name||'建築物';
          if(source){source._v0754AssignedPalUid=x.card.uid;source._v0754AssignedPalName=x.card.name}
          log(pl.name+': '+x.card.name+' を '+source.name+' にアサイン');
          showAssignToast(x.card.name,source.name);
          cb(x.card);
          setTimeout(schedule,0);
        })
      };
      chooseAssign.__v0754Wrapped=true;
    }
  }catch(_e){}

  try{
    if(typeof beginTurn==='function'&&!beginTurn.__v0754Wrapped){
      const oldBeginTurn=beginTurn;
      beginTurn=function(){
        try{
          if(G&&!G.over){
            const pl=G[G.turn];
            if(pl){
              pl.pals.forEach(function(c){delete c._v0754AssignedToUid;delete c._v0754AssignedToName});
              pl.supports.forEach(function(c){delete c._v0754AssignedPalUid;delete c._v0754AssignedPalName});
            }
          }
        }catch(_e){}
        return oldBeginTurn.apply(this,arguments)
      };
      beginTurn.__v0754Wrapped=true;
    }
  }catch(_e){}

  function cardNodes(uid){
    try{return Array.from(document.querySelectorAll('.board .card[data-uid="'+uid+'"],.v04Play .card[data-uid="'+uid+'"]'))}catch(_e){return []}
  }
  function addBadge(node,text,isStructure){
    if(!node||node.querySelector(':scope > .v0754AssignBadge'))return;
    const b=document.createElement('div');b.className='v0754AssignBadge'+(isStructure?' v0754OnStructure':'');b.textContent=text;node.appendChild(b)
  }
  function sync(){
    queued=false;
    try{
      document.querySelectorAll('.v0754AssignedPal,.v0754AssignedStructure').forEach(function(n){n.classList.remove('v0754AssignedPal','v0754AssignedStructure')});
      document.querySelectorAll('.v0754AssignBadge').forEach(function(n){n.remove()});
      if(!G)return;
      [G.p,G.a].forEach(function(pl){
        if(!pl)return;
        pl.pals.forEach(function(pal){
          if(!pal||!pal._v0754AssignedToUid)return;
          const source=pl.supports.find(function(s){return s.uid===pal._v0754AssignedToUid});
          const sourceName=(source&&source.name)||pal._v0754AssignedToName||'建築物';
          cardNodes(pal.uid).forEach(function(n){n.classList.add('v0754AssignedPal');addBadge(n,'ASSIGN → '+sourceName,false)});
          if(source){cardNodes(source.uid).forEach(function(n){n.classList.add('v0754AssignedStructure');addBadge(n,pal.name+' → ASSIGN',true)})}
        })
      })
    }catch(_e){}
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(sync)}
  try{new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true})}catch(_e){}
  document.addEventListener('pointerup',schedule,{passive:true});
  addEventListener('pageshow',sync,{passive:true});addEventListener('resize',schedule,{passive:true});
  sync();setTimeout(sync,200);setTimeout(sync,800);
  console.info('Palworld OCG v0.7.61 assignment clarity applied');
})();
</script>


<style id="v0755AbilityConfirmStyle">
.v0755AbilityConfirm{
  position:fixed!important;inset:0!important;z-index:2147483645!important;
  display:flex!important;align-items:center!important;justify-content:center!important;
  padding:12px!important;background:#03120de8!important;backdrop-filter:blur(3px)!important;
}
.v0755AbilityCard{
  width:min(620px,82vw)!important;max-height:82vh!important;overflow:auto!important;
  border:2px solid #7ee7b1!important;border-radius:16px!important;
  background:linear-gradient(180deg,#0d2b20,#081b15)!important;color:#f7fff9!important;
  box-shadow:0 18px 56px #000d,0 0 28px #70e8ae33!important;padding:12px!important;
}
.v0755AbilityTitle{font-size:15px!important;font-weight:1000!important;line-height:1.25!important;margin-bottom:5px!important}
.v0755AbilitySub{font-size:9px!important;color:#bfe9d2!important;margin-bottom:8px!important;white-space:normal!important}
.v0755AbilityEffect{font-size:10px!important;line-height:1.45!important;padding:8px 9px!important;border-radius:10px!important;background:#071812!important;border:1px solid #315e49!important;white-space:pre-wrap!important}
.v0755AbilityCost{display:grid!important;gap:5px!important;margin:8px 0 10px!important}
.v0755CostRow{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;padding:6px 8px!important;border-radius:9px!important;background:#123629!important;border:1px solid #4f9a73!important;font-size:10px!important;font-weight:900!important}
.v0755CostRow strong{font-size:13px!important;color:#ffe989!important;letter-spacing:.2px!important;white-space:nowrap!important}
.v0755AbilityNote{font-size:8px!important;color:#b8d4c4!important;margin-top:5px!important}
.v0755AbilityButtons{display:grid!important;grid-template-columns:1fr 1.15fr!important;gap:7px!important;margin-top:8px!important}
.v0755AbilityButtons button{padding:8px 6px!important;border-radius:10px!important;font-size:10px!important;font-weight:1000!important;border:1px solid #4e8f6e!important}
.v0755AbilityCancel{background:#26332d!important;color:#e8f2ec!important}
.v0755AbilityUse{background:#27b56f!important;color:#06150e!important;border-color:#78f2b5!important}
@media(max-height:520px) and (orientation:landscape){
  .v0755AbilityConfirm{padding:5px!important}
  .v0755AbilityCard{width:min(600px,76vw)!important;max-height:90vh!important;padding:8px!important}
  .v0755AbilityTitle{font-size:12px!important;margin-bottom:3px!important}
  .v0755AbilitySub,.v0755AbilityEffect,.v0755CostRow,.v0755AbilityButtons button{font-size:8px!important}
  .v0755AbilityEffect{padding:5px 7px!important;line-height:1.3!important}
  .v0755AbilityCost{margin:5px 0 6px!important;gap:3px!important}
  .v0755CostRow{padding:4px 6px!important}.v0755CostRow strong{font-size:10px!important}
  .v0755AbilityButtons button{padding:6px 5px!important}
}
</style>
<script id="v0755AbilityConfirmScript">
(()=>{
  if(globalThis.__v0755AbilityConfirmApplied)return;
  globalThis.__v0755AbilityConfirmApplied=true;
  let armed=false,lastCommitKey='',lastCommitAt=0,openKey='';

  function esc(v){return String(v==null?'':v).replace(/[&<>\"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]||m})}
  function num(v){v=Number(v||0);return isFinite(v)?v:0}
  function findCard(pl,uid){try{return pl.pals.concat(pl.supports).find(function(x){return x.uid===uid})}catch(_e){return null}}
  function actText(c){
    try{if(typeof v050ActSegment==='function')return String(v050ActSegment(c)||'')}catch(_e){}
    return String(c&&c.ability||'')
  }
  function add(rows,label,before,after){rows.push({label:label,before:String(before),after:String(after),arrow:true})}
  function addText(rows,label,text){rows.push({label:label,text:String(text),arrow:false})}
  function costRows(pl,c){
    const rows=[];
    const e=String(c&&c.effect||'');
    if(e==='self_mat_buff')add(rows,'素材',num(pl.material),Math.max(0,num(pl.material)-2));
    else if(e==='self_ing_buff')add(rows,'食材',num(pl.ingredient),Math.max(0,num(pl.ingredient)-2));
    else if(e==='weaponbench'){
      add(rows,'素材',num(pl.material),Math.max(0,num(pl.material)-1));
      addText(rows,'アサイン','STANDのパル1体 → REST');
    }else if(e==='campfire'){
      add(rows,'食材',num(pl.ingredient),Math.max(0,num(pl.ingredient)-2));
      addText(rows,'アサイン','STANDのパル1体 → REST');
    }else if(['stonepit','berryfarm','primitivebench','hangingtrap'].includes(e)){
      addText(rows,'アサイン','STANDのパル1体 → REST');
    }else if(['rifle','launcher','spear','cawhat'].includes(e)){
      addText(rows,'このカード','STAND → REST');
    }else if(e==='blizzamoth'){
      addText(rows,'手札コスト','建築物1枚を墓地へ');
    }

    if(c&&c.bpGeneric){
      const t=actText(c);let m;
      if((m=t.match(/Consume\s+(\d+)\s+Material/i)))add(rows,'素材',num(pl.material),Math.max(0,num(pl.material)-num(m[1])));
      if((m=t.match(/Consume\s+(\d+)\s+Ingredient/i)))add(rows,'食材',num(pl.ingredient),Math.max(0,num(pl.ingredient)-num(m[1])));
      if(/Assign\s+1\s+Pal/i.test(t))addText(rows,'アサイン','STANDのパル1体 → REST');
      if(/Rest\s+this\s+card/i.test(t))addText(rows,'このカード','STAND → REST');
      try{
        const sc=typeof v050CircledCost==='function'?num(v050CircledCost(t)):0;
        if(sc){
          const now=typeof standingSouls==='function'?num(standingSouls(pl)):0;
          add(rows,'ソウル',now,Math.max(0,now-sc));
        }
      }catch(_e){}
      if((m=t.match(/Discard\s+(\d+)\s+cards?\s+from\s+hand/i)))addText(rows,'手札',num(m[1])+'枚を捨てる');
      if(/Butcher\s+1\s+other\s+Pal/i.test(t))addText(rows,'コスト','他のパル1体をButcher');
    }

    /* Remove exact duplicate descriptions when a generic card also maps to a built-in effect. */
    const seen=new Set();
    return rows.filter(function(r){const k=r.label+'|'+(r.arrow?r.before+'>'+r.after:r.text);if(seen.has(k))return false;seen.add(k);return true})
  }
  function close(){openKey='';try{document.querySelectorAll('.v0755AbilityConfirm').forEach(function(n){n.remove()})}catch(_e){}}
  function show(pl,c,uid,oldActivate){
    const key=String((G&&G.turnSeq)||0)+'|'+String(uid);
    if(openKey===key&&document.querySelector('.v0755AbilityConfirm'))return;
    close();openKey=key;
    const rows=costRows(pl,c);
    const costs=rows.length?rows.map(function(r){
      return '<div class="v0755CostRow"><span>'+esc(r.label)+'</span><strong>'+(r.arrow?esc(r.before)+' → '+esc(r.after):esc(r.text))+'</strong></div>'
    }).join(''):'<div class="v0755CostRow"><span>消費</span><strong>なし</strong></div>';
    const modal=document.createElement('div');modal.className='v0755AbilityConfirm';
    modal.innerHTML='<div class="v0755AbilityCard" role="dialog" aria-modal="true">'+
      '<div class="v0755AbilityTitle">'+esc(c.name)+' の能力を使いますか？</div>'+
      '<div class="v0755AbilitySub">実行前に消費内容を確認してください</div>'+
      '<div class="v0755AbilityEffect">'+esc(c.ability||'能力テキストなし')+'</div>'+
      '<div class="v0755AbilityCost">'+costs+'</div>'+
      '<div class="v0755AbilityNote">確定するまで素材・食材・ソウル・カード状態は変更されません。</div>'+
      '<div class="v0755AbilityButtons"><button class="v0755AbilityCancel" type="button">キャンセル</button><button class="v0755AbilityUse" type="button">能力を使う</button></div>'+
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('pointerdown',function(ev){if(ev.target===modal)close()});
    modal.querySelector('.v0755AbilityCancel').onclick=function(){close()};
    modal.querySelector('.v0755AbilityUse').onclick=function(){
      const btn=this,commitKey=String((G&&G.turnSeq)||0)+'|'+String(uid),now=Date.now();
      if(btn.disabled||armed||(lastCommitKey===commitKey&&now-lastCommitAt<900))return;
      btn.disabled=true;btn.textContent='実行中…';lastCommitKey=commitKey;lastCommitAt=now;
      close();armed=true;try{oldActivate.call(globalThis,pl,uid)}finally{armed=false}
    };
  }

  try{
    if(typeof activateAbility==='function'&&!activateAbility.__v0755Wrapped){
      const oldActivate=activateAbility;
      const wrapped=function(pl,uid){
        const c=findCard(pl,uid);
        if(armed||!c||!pl||pl.isAI||pl!==G?.p)return oldActivate.apply(this,arguments);
        try{if(typeof canActivate==='function'&&!canActivate(pl,c))return}catch(_e){}
        show(pl,c,uid,oldActivate);
      };
      wrapped.__v0755Wrapped=true;wrapped.__v0755Old=oldActivate;activateAbility=wrapped;
    }
  }catch(_e){console.warn('v0.7.55 ability confirm wrap failed',_e)}
  console.info('Palworld OCG v0.7.61 ability confirmation applied');
})();
</script>

<style id="v0756PolishStyle">
/* v0.7.61 — keep action controls inside phone safe areas and make CPU actions readable. */
.modal.v0754ChoiceSheet{padding-bottom:max(8px,env(safe-area-inset-bottom))!important}
.v0756CpuSpeedBtn{
  flex:0 0 auto!important;margin-left:4px!important;padding:2px 6px!important;min-height:0!important;
  border-radius:999px!important;border:1px solid #ffffff35!important;background:#0b2119dd!important;
  color:#dff8e9!important;font-size:6.5px!important;line-height:1.25!important;font-weight:900!important;
  white-space:nowrap!important;opacity:.9!important;z-index:30!important;
}
.v0756CpuAction{
  position:fixed!important;left:50%!important;top:24px!important;transform:translateX(-50%)!important;
  z-index:2147483300!important;max-width:min(720px,82vw)!important;padding:5px 10px!important;
  border-radius:10px!important;border:1px solid #7dcfa3!important;background:#071a13f2!important;
  color:#ecfff4!important;box-shadow:0 5px 20px #000b!important;font-size:8px!important;line-height:1.25!important;
  font-weight:900!important;text-align:center!important;pointer-events:none!important;
}
@media(max-height:520px) and (orientation:landscape){
  .v0756CpuAction{top:18px!important;font-size:7px!important;padding:4px 8px!important}
  .v0756CpuSpeedBtn{font-size:6px!important;padding:2px 5px!important}
}
</style>
<script id="v0756PolishScript">
(()=>{
  if(globalThis.__v0756PolishApplied)return;
  globalThis.__v0756PolishApplied=true;
  const KEY='palworld_cpu_speed_v0769';
  const MODES=['slow','normal','fast','instant'];
  const LABELS={slow:'CPU ゆっくり',normal:'CPU 普通',fast:'CPU 速い',instant:'CPU 即時'};
  let mode='slow',cpuQueue=[],cpuShowing=false,cpuTimer=0,queued=false;
  try{const v=localStorage.getItem(KEY);if(MODES.includes(v))mode=v}catch(_e){}

  function cpuTurn(){
    try{return !!(G&&G.turn&&G[G.turn]&&G[G.turn].isAI)}catch(_e){return false}
  }
  function delayFor(ms){
    let d=Math.max(0,Number(ms)||0);
    if(!cpuTurn())return d;
    try{if(typeof v077Stress!=='undefined'&&v077Stress?.active)return Math.min(d,12)}catch(_e){}
    if(mode==='instant')return Math.min(d,30);
    if(mode==='fast')return Math.max(d,600);
    if(mode==='normal')return Math.max(d,1050);
    return Math.max(d,1550);
  }
  function saveMode(v){mode=v;try{localStorage.setItem(KEY,v)}catch(_e){}syncButton()}
  function cycleMode(){saveMode(MODES[(MODES.indexOf(mode)+1)%MODES.length])}
  function syncButton(){
    let b=document.getElementById('v0756CpuSpeedBtn');
    const title=document.querySelector('.v04Title');
    if(!title)return;
    if(!b){
      b=document.createElement('button');b.id='v0756CpuSpeedBtn';b.type='button';b.className='v0756CpuSpeedBtn';
      b.title='CPUの行動表示速度を切り替え';b.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();cycleMode()});
      title.insertAdjacentElement('afterend',b);
    }
    b.textContent=LABELS[mode]||LABELS.normal;
  }
  function cleanLog(v){return String(v==null?'':v).replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()}
  function enqueueCpu(msg){
    msg=cleanLog(msg);if(!msg)return;
    if(cpuQueue[cpuQueue.length-1]===msg)return;
    cpuQueue.push(msg);if(cpuQueue.length>6)cpuQueue.shift();pumpCpu();
  }
  function pumpCpu(){
    if(cpuShowing||!cpuQueue.length||mode==='instant')return;
    cpuShowing=true;
    const msg=cpuQueue.shift();
    let el=document.querySelector('.v0756CpuAction');
    if(!el){el=document.createElement('div');el.className='v0756CpuAction';document.body.appendChild(el)}
    el.textContent='CPU：'+msg;
    clearTimeout(cpuTimer);
    cpuTimer=setTimeout(function(){try{el.remove()}catch(_e){}cpuShowing=false;pumpCpu()},mode==='instant'?220:(mode==='fast'?650:(mode==='normal'?1050:1500)));
  }

  /* AI scheduling helper used by the current app. Rules/state are untouched; only presentation delay changes. */
  try{
    if(typeof v070Schedule==='function'&&!v070Schedule.__v0756Wrapped){
      const base=v070Schedule;
      const wrapped=function(fn,ms){
        const args=Array.from(arguments);args[1]=delayFor(ms);return base.apply(this,args);
      };
      wrapped.__v0756Wrapped=true;wrapped.__v0756Old=base;v070Schedule=wrapped;
    }
  }catch(_e){}

  /* Show CPU action logs long enough to follow even when a particular AI path does not use v070Schedule. */
  try{
    if(typeof log==='function'&&!log.__v0756Wrapped){
      const baseLog=log;
      const wrappedLog=function(msg){const wasCpu=cpuTurn();const r=baseLog.apply(this,arguments);if(wasCpu)enqueueCpu(msg);return r};
      wrappedLog.__v0756Wrapped=true;wrappedLog.__v0756Old=baseLog;log=wrappedLog;
    }
  }catch(_e){}

  function sync(){
    queued=false;
    try{
      const title=document.querySelector('.v04Title');if(title&&title.textContent!=='v0.7.70')title.textContent='v0.7.73';
      document.querySelectorAll('.badge.official').forEach(function(b){if(/^v?0\.7\.\d+/.test((b.textContent||'').trim()))b.textContent='v0.7.73'});
      syncButton();
    }catch(_e){}
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(sync)}
  try{new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true})}catch(_e){}
  addEventListener('pageshow',sync,{passive:true});addEventListener('resize',schedule,{passive:true});
  document.addEventListener('pointerup',schedule,{passive:true});
  sync();setTimeout(sync,200);setTimeout(sync,900);
  console.info('Palworld OCG v0.7.61 UI polish + CPU pacing applied');
})();
</script>



<style id="v0757CenterActionStyle">
/* v0.7.61 — center action callout + slightly larger, easier-to-read hand cards. */
.app.v04.v0738CenterRifleFix .v04HandBar{
  height:100px!important;
  min-height:100px!important;
  padding:2px 4px 3px!important;
}
.app.v04.v0738CenterRifleFix .v04Hand{
  padding:8px 7px 3px!important;
}
.app.v04.v0738CenterRifleFix .v04Hand>.card{
  height:88px!important;
  width:66px!important;
  flex-basis:66px!important;
}
.app.v04.v0738CenterRifleFix .v04HandCaption{font-size:7px!important;line-height:1.2!important}

.v0757ActionCenter{
  position:fixed!important;inset:0!important;z-index:2147482850!important;
  display:flex!important;align-items:center!important;justify-content:center!important;
  pointer-events:none!important;padding:12px!important;
}
.v0757ActionCenter[hidden]{display:none!important}
.v0757ActionBubble{
  max-width:min(82vw,560px)!important;min-width:min(220px,50vw)!important;
  display:flex!important;align-items:center!important;gap:12px!important;
  background:linear-gradient(180deg,rgba(19,23,34,.96),rgba(8,10,16,.94))!important;
  border:1px solid rgba(246,212,110,.88)!important;border-radius:16px!important;
  box-shadow:0 12px 34px rgba(0,0,0,.42),0 0 0 1px rgba(255,255,255,.06) inset!important;
  padding:12px 14px!important;color:#fff!important;
  transform:translateY(-34px)!important;
}
.v0757ActionCardWrap{
  width:96px!important;min-width:96px!important;display:flex!important;justify-content:center!important;align-items:center!important;
}
.v0757ActionCard{
  width:88px!important;max-width:88px!important;height:auto!important;transform:scale(1.08)!important;transform-origin:center center!important;
  pointer-events:none!important;box-shadow:0 8px 18px rgba(0,0,0,.28)!important;
}
.v0757ActionCard .infoBtn,
.v0757ActionCard button,
.v0757ActionCard .v0754AssignOnPal,
.v0757ActionCard .v0754AssignOnSource{display:none!important}
.v0757ActionText{min-width:0!important;display:flex!important;flex-direction:column!important;gap:4px!important}
.v0757ActionKicker{
  font-size:9px!important;line-height:1!important;font-weight:900!important;letter-spacing:.1em!important;
  color:#f4d46f!important;text-transform:uppercase!important;
}
.v0757ActionMain{
  font-size:14px!important;line-height:1.35!important;font-weight:800!important;color:#fff!important;
  text-wrap:balance!important;
}
.v0757ActionSub{
  font-size:10px!important;line-height:1.3!important;color:#d7dbe6!important;opacity:.92!important;
}
@media (max-height:520px) and (orientation:landscape){
  .app.v04.v0738CenterRifleFix .v04HandBar{height:96px!important;min-height:96px!important}
  .app.v04.v0738CenterRifleFix .v04Hand>.card{height:86px!important;width:65px!important;flex-basis:65px!important}
  .v0757ActionBubble{padding:10px 12px!important;gap:10px!important;transform:translateY(-22px)!important}
  .v0757ActionCardWrap{width:84px!important;min-width:84px!important}
  .v0757ActionCard{width:78px!important;max-width:78px!important}
  .v0757ActionMain{font-size:12px!important}
  .v0757ActionSub{font-size:8px!important}
}
</style>
<script id="v0757CenterActionScript">
(()=>{
  if(globalThis.__v0757CenterActionApplied)return;
  globalThis.__v0757CenterActionApplied=true;
  let q=[],showing=false,timer=0,lastMsg='';

  function cpuSpeedMode(){
    try{
      const txt=(document.getElementById('v0756CpuSpeedBtn')?.textContent||'').trim();
      if(txt.includes('即時'))return 'instant';
      if(txt.includes('×2'))return 'fast';
    }catch(_e){}
    return 'normal';
  }
  function durationFor(isCpu){
    if(!isCpu)return 1080;
    const m=cpuSpeedMode();
    if(m==='instant')return 430;
    if(m==='fast')return 620;
    return 860;
  }
  function stripHtml(v){return String(v==null?'':v).replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()}
  function clean(v){
    let s=stripHtml(v);
    s=s.replace(/^(YOU|OPPONENT|CPU\d*|相手|あなた)\s*[:：]\s*/,'');
    s=s.replace(/^CPU：/,'');
    return s.trim();
  }
  function isInteresting(msg){
    if(!msg)return false;
    if(/^(先攻|後攻)\s*[:：]/.test(msg))return false;
    if(/ソウル1枚で開始/.test(msg))return false;
    if(/^(ターン|TURN)\s*\d+/i.test(msg))return false;
    return /(登場|攻撃|アサイン|能力|発動|装備|ダメージチェック|手札|加え|回収|REST|STAND|捨て|破壊|墓地|ドロー|引き|進化|召喚|プレイ)/.test(msg);
  }
  function findCardNode(msg){
    try{
      const nodes=[...document.querySelectorAll('.v04Hand>.card[data-uid], .v04Play .card[data-uid], #v04Detail .card, #v0754FullDetailOverlay .card')];
      let best=null,bestScore=0;
      nodes.forEach(node=>{
        let name=(node.querySelector('.name')?.textContent||node.getAttribute('aria-label')||'').trim();
        if(!name)return;
        let score=0;
        if(msg.includes(name))score=name.length+8;
        else{
          const parts=name.split(/[\-–]/).map(x=>x.trim()).filter(Boolean);
          for(const part of parts){if(part && msg.includes(part))score=Math.max(score,part.length)}
        }
        if(score>bestScore){best=node;bestScore=score}
      });
      return best;
    }catch(_e){return null}
  }
  function cardHtmlFrom(node){
    if(!node)return '';
    try{
      const clone=node.cloneNode(true);
      clone.classList.add('v0757ActionCard');
      clone.querySelectorAll('button,.infoBtn,.v0754AssignOnPal,.v0754AssignOnSource').forEach(x=>x.remove());
      clone.removeAttribute('onclick');clone.removeAttribute('onpointerup');clone.removeAttribute('onpointerdown');
      return '<div class="v0757ActionCardWrap">'+clone.outerHTML+'</div>';
    }catch(_e){return ''}
  }
  function classify(msg){
    if(/ダメージチェック/.test(msg))return 'DAMAGE CHECK';
    if(/アサイン/.test(msg))return 'ASSIGN';
    if(/能力|発動/.test(msg))return 'ABILITY';
    if(/攻撃/.test(msg))return 'ATTACK';
    if(/登場|召喚|プレイ/.test(msg))return 'PLAY';
    if(/装備/.test(msg))return 'EQUIP';
    if(/手札|回収|加え|ドロー|引き/.test(msg))return 'HAND';
    return 'ACTION';
  }
  function ensureHost(){
    let host=document.getElementById('v0757ActionCenter');
    if(host)return host;
    host=document.createElement('div');
    host.id='v0757ActionCenter';host.className='v0757ActionCenter';host.hidden=true;
    document.body.appendChild(host);
    return host;
  }
  function render(item){
    const host=ensureHost();
    const card=cardHtmlFrom(findCardNode(item.msg));
    const kicker=classify(item.msg);
    const sub=item.isCpu?'CPUの行動':'進行中の処理';
    host.innerHTML='<div class="v0757ActionBubble">'+card+'<div class="v0757ActionText"><div class="v0757ActionKicker">'+kicker+'</div><div class="v0757ActionMain">'+item.msg.replace(/[&<>\"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]))+'</div><div class="v0757ActionSub">'+sub+'</div></div></div>';
    host.hidden=false;
  }
  function hide(){
    const host=document.getElementById('v0757ActionCenter');
    if(host)host.hidden=true;
  }
  function pump(){
    if(showing||!q.length)return;
    showing=true;
    const item=q.shift();
    render(item);
    clearTimeout(timer);
    timer=setTimeout(function(){hide();showing=false;pump()},durationFor(item.isCpu));
  }
  function enqueue(msg,isCpu){
    msg=clean(msg);
    if(!isInteresting(msg))return;
    if(msg===lastMsg)return;
    lastMsg=msg;
    q.push({msg,isCpu:!!isCpu});
    if(q.length>8)q.shift();
    pump();
    setTimeout(()=>{if(lastMsg===msg)lastMsg=''},250);
  }
  try{
    if(typeof log==='function'&&!log.__v0757Wrapped){
      const base=log;
      const wrapped=function(msg){
        const isCpu=!!(G&&G.turn&&G[G.turn]&&G[G.turn].isAI);
        const r=base.apply(this,arguments);
        try{enqueue(msg,isCpu)}catch(_e){}
        return r;
      };
      wrapped.__v0757Wrapped=true;wrapped.__v0757Old=base;log=wrapped;
    }
  }catch(_e){console.warn('v0.7.61 center action wrap failed',_e)}
  addEventListener('pageshow',()=>{hide();q.length=0;showing=false},{passive:true});
  console.info('Palworld OCG v0.7.61 center action display applied');
})();
</script>


<style id="v0762DiagnosticsStyle">
.v0762DiagBtn{
  border:1px solid #8bc8b4!important;background:#0b211c!important;color:#eafff7!important;
  border-radius:999px!important;padding:3px 7px!important;font-size:7px!important;font-weight:900!important;
  white-space:nowrap!important;box-shadow:0 2px 8px #0008!important;z-index:90!important;
}
.v0762DiagBtn.hasError{border-color:#ff756c!important;background:#3a1112!important;color:#fff0ef!important}
.v0762DiagOverlay{
  position:fixed!important;inset:0!important;z-index:2147483200!important;background:#000b!important;
  display:flex!important;align-items:center!important;justify-content:center!important;padding:8px!important;
}
.v0762DiagOverlay[hidden]{display:none!important}
.v0762DiagPanel{
  width:min(720px,94vw)!important;max-height:90dvh!important;overflow:auto!important;
  background:#071713!important;border:1px solid #6fb5a0!important;border-radius:14px!important;
  color:#f5fffb!important;padding:12px!important;box-shadow:0 14px 42px #000d!important;
}
.v0762DiagHead{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;margin-bottom:8px!important}
.v0762DiagTitle{font-size:15px!important;font-weight:950!important;color:#fff!important}
.v0762DiagClose{border:1px solid #829a93!important;background:#14241f!important;color:#fff!important;border-radius:8px!important;padding:5px 10px!important}
.v0762DiagSummary{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important;margin-bottom:8px!important}
.v0762DiagStat{border:1px solid #274c40!important;background:#0b211b!important;border-radius:9px!important;padding:7px!important;text-align:center!important}
.v0762DiagStat b{display:block!important;font-size:15px!important}.v0762DiagStat span{font-size:7px!important;color:#bdd2cb!important}
.v0762DiagActions{display:flex!important;flex-wrap:wrap!important;gap:6px!important;margin:8px 0!important}
.v0762DiagActions button{border:1px solid #557c70!important;background:#102b23!important;color:#fff!important;border-radius:8px!important;padding:7px 10px!important;font-size:8px!important;font-weight:850!important}
.v0762DiagActions button.primary{border-color:#d7ba58!important;background:#483b0c!important;color:#fff7d2!important}
.v0762DiagNote{font-size:7.5px!important;line-height:1.45!important;color:#bdcec8!important;margin:6px 0!important}
.v0762DiagList{display:flex!important;flex-direction:column!important;gap:5px!important;margin-top:8px!important}
.v0762DiagItem{border:1px solid #3f5750!important;background:#0b1512!important;border-radius:9px!important;padding:7px!important}
.v0762DiagItem.error{border-color:#873b3d!important;background:#231012!important}
.v0762DiagCode{font-size:10px!important;font-weight:950!important;color:#ff9d95!important}.v0762DiagMsg{font-size:8px!important;margin-top:2px!important}.v0762DiagMeta{font-size:6.5px!important;color:#9db0aa!important;margin-top:3px!important;word-break:break-word!important}
.v0762ErrorToast{
  position:fixed!important;left:50%!important;bottom:max(9px,env(safe-area-inset-bottom))!important;transform:translateX(-50%)!important;
  z-index:2147483250!important;max-width:82vw!important;border:1px solid #ff716b!important;background:#3b0d10f2!important;
  color:#fff!important;border-radius:10px!important;padding:7px 12px!important;box-shadow:0 8px 28px #000c!important;
  font-size:9px!important;font-weight:900!important;pointer-events:auto!important;text-align:center!important;
}
@media(max-height:520px) and (orientation:landscape){
  .v0762DiagPanel{max-height:94dvh!important;padding:8px!important}.v0762DiagTitle{font-size:12px!important}
  .v0762DiagSummary{gap:4px!important}.v0762DiagStat{padding:4px!important}.v0762DiagStat b{font-size:11px!important}
  .v0762DiagActions button{padding:5px 8px!important;font-size:7px!important}.v0762DiagItem{padding:5px!important}
}
</style>
<script id="v0762DiagnosticsScript">
(()=>{
  if(globalThis.__v0762DiagnosticsApplied)return;
  globalThis.__v0762DiagnosticsApplied=true;

  const VERSION='0.7.64';
  const STORE='palworld_diag_v0762';
  const MAX=80;
  const OFFICIAL_QA_TOTAL=97;
  const OFFICIAL_CHECKED_AT='2026-08-23';
  let busyTest=false, validating=false, toastTimer=0, lastSig='';

  const CODE={
    JS:'ERR-SYSTEM-0001',PROMISE:'ERR-SYSTEM-0002',CORE:'ERR-SYSTEM-0100',
    STATE:'ERR-STATE-0001',NUMBER:'ERR-STATE-0002',ZONE:'ERR-ZONE-0001',DUP:'ERR-ZONE-0002',
    DAMAGE:'ERR-DMG-0001',DAMAGE_GRAVE:'ERR-DMG-0002',DAMAGE_LIFE:'ERR-DMG-0003',
    BATTLE:'ERR-BATTLE-0001',ABILITY:'ERR-ABILITY-0001',PLAY:'ERR-PLAY-0001',ASSIGN:'ERR-ASSIGN-0001',
    RULE:'ERR-RULE-0001',RULE_RUN:'ERR-RULE-0002',CARD_DB:'ERR-RULE-0100'
  };
  globalThis.PAL_DIAG_CODES=CODE;

  function clean(v){return String(v==null?'':v).replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()}
  function safeNum(v){return typeof v==='number'&&Number.isFinite(v)}
  function cardLite(c){
    if(!c)return null;
    return {uid:c.uid??null,no:c.no||'',name:c.name||'',kind:c.kind||'',rest:!!c.rest,damage:Number(c.damage||0),power:Number(c.power||0),tempPower:Number(c.tempPower||0),strike:Number(c.strike||0),tempStrike:Number(c.tempStrike||0),lucky:!!c.lucky};
  }
  function playerLite(pl){
    if(!pl)return null;
    const zones={};
    ['deck','hand','pals','supports','grave','exile'].forEach(z=>zones[z]=Array.isArray(pl[z])?pl[z].map(cardLite):[]);
    return {name:pl.name||'',life:pl.life,soulDeck:pl.soulDeck,standingSouls:Array.isArray(pl.souls)?pl.souls.filter(x=>!x.rest).length:null,souls:Array.isArray(pl.souls)?pl.souls.length:null,material:pl.material,ingredient:pl.ingredient,zones};
  }
  function snapshot(extra){
    let game=null;
    try{
      if(typeof G!=='undefined'&&G)game={turn:G.turn,turnSeq:G.turnSeq,phase:G.phase,over:!!G.over,winner:G.winner||'',reason:G.reason||'',p:playerLite(G.p),a:playerLite(G.a),logs:Array.isArray(G.logs)?G.logs.slice(0,20).map(clean):[]};
    }catch(_e){}
    return {version:VERSION,at:new Date().toISOString(),game,extra:extra||null};
  }
  function load(){try{const a=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(a)?a:[]}catch(_e){return []}}
  function save(a){try{localStorage.setItem(STORE,JSON.stringify(a.slice(0,MAX)))}catch(_e){}}
  function codeLabel(code){return code||CODE.CORE}
  function showToast(entry){
    try{
      let t=document.getElementById('v0762ErrorToast');
      if(!t){t=document.createElement('button');t.type='button';t.id='v0762ErrorToast';t.className='v0762ErrorToast';t.addEventListener('click',openPanel);document.body.appendChild(t)}
      t.textContent='⚠ '+entry.code+'　'+entry.message+'　（タップで診断）';t.hidden=false;
      clearTimeout(toastTimer);toastTimer=setTimeout(()=>{if(t)t.hidden=true},4200);
    }catch(_e){}
  }
  function record(code,message,meta,err,quiet){
    try{
      const stack=clean(err&&err.stack||'').slice(0,1800);
      const sig=[code,message,meta&&meta.op,stack.slice(0,120)].join('|');
      const now=Date.now();
      const old=load();
      if(old[0]&&old[0].sig===sig&&now-Number(old[0].ts||0)<1200)return old[0];
      const entry={id:'D'+now.toString(36).toUpperCase(),ts:now,sig,code:codeLabel(code),message:clean(message).slice(0,300),meta:meta||null,stack,state:snapshot(meta)};
      old.unshift(entry);save(old);syncButton();
      if(!quiet)showToast(entry);
      return entry;
    }catch(_e){return null}
  }
  globalThis.palDiagRecord=record;

  function checkPlayer(pl,label,issues){
    if(!pl||typeof pl!=='object'){issues.push([CODE.STATE,label+' player object missing']);return}
    const nums=['life','soulDeck','material','ingredient'];
    nums.forEach(k=>{if(pl[k]!=null&&(!safeNum(pl[k])||pl[k]<0&&k!=='life'))issues.push([CODE.NUMBER,label+' '+k+'='+String(pl[k])])});
    if(!Array.isArray(pl.souls))issues.push([CODE.ZONE,label+' souls is not array']);
    const zones=['deck','hand','pals','supports','grave','exile'];
    const seen=new Map();
    zones.forEach(z=>{
      if(!Array.isArray(pl[z])){issues.push([CODE.ZONE,label+' '+z+' is not array']);return}
      pl[z].forEach((c,i)=>{
        if(!c||typeof c!=='object'){issues.push([CODE.ZONE,label+' '+z+'['+i+'] invalid']);return}
        const uid=String(c.uid??'');
        if(uid){if(seen.has(uid))issues.push([CODE.DUP,label+' UID '+uid+' duplicated in '+seen.get(uid)+' / '+z]);else seen.set(uid,z)}
        if(c.damage!=null&&(!safeNum(Number(c.damage))||Number(c.damage)<0))issues.push([CODE.NUMBER,label+' '+z+' '+(c.no||c.name||uid)+' damage='+String(c.damage)]);
      });
    });
  }
  function validate(context,quiet){
    if(validating)return true;validating=true;
    try{
      if(typeof G==='undefined'||!G)return true;
      const issues=[];
      if(!G.p||!G.a)issues.push([CODE.STATE,'G.p / G.a missing']);
      else{checkPlayer(G.p,'YOU',issues);checkPlayer(G.a,'OPPONENT',issues)}
      if(G.turn!=null&&!['p','a'].includes(G.turn))issues.push([CODE.STATE,'invalid turn='+String(G.turn)]);
      issues.slice(0,8).forEach(x=>record(x[0],x[1],{op:'validate',context:context||''},null,quiet));
      return !issues.length;
    }catch(e){record(CODE.STATE,'state validation crashed',{op:'validate',context},e,quiet);return false}
    finally{validating=false}
  }
  globalThis.palValidateState=validate;

  function wrap(name,code,after){
    try{
      const old=globalThis[name];if(typeof old!=='function'||old.__v0762DiagWrapped)return;
      const wrapped=function(){
        let r;
        try{r=old.apply(this,arguments)}catch(e){record(code||CODE.CORE,name+' threw an exception',{op:name,args:[...arguments].slice(0,3).map(x=>typeof x==='object'?(x?.no||x?.name||x?.uid||'[object]'):x)},e);throw e}
        try{if(after)after(arguments,r);else setTimeout(()=>validate(name,true),0)}catch(e){record(CODE.CORE,name+' diagnostic hook failed',{op:name},e,true)}
        return r;
      };
      wrapped.__v0762DiagWrapped=true;wrapped.__v0762DiagOld=old;globalThis[name]=wrapped;
    }catch(e){record(CODE.CORE,'failed to wrap '+name,{op:'wrap'},e,true)}
  }

  function wrapPlayerDamage(){
    try{
      const old=globalThis.playerDamage;if(typeof old!=='function'||old.__v0762DiagWrapped)return;
      const wrapped=function(def,amount){
        const n=Math.max(0,Number(amount)||0),beforeLife=Number(def?.life),beforeDeck=Array.isArray(def?.deck)?def.deck.slice():[],beforeGrave=Array.isArray(def?.grave)?def.grave.slice():[];
        const expected=[];let lucky=false;
        for(let i=0;i<n&&i<beforeDeck.length;i++){const c=beforeDeck[i];expected.push(c);if(c?.lucky){lucky=true;break}}
        let r;
        try{r=old.apply(this,arguments)}catch(e){record(CODE.DAMAGE,'playerDamage exception',{op:'playerDamage',amount:n,def:def?.name||''},e);throw e}
        try{
          const grave=Array.isArray(def?.grave)?def.grave:[];
          const moved=expected.every(c=>grave.some(g=>g?.uid===c?.uid));
          if(!moved)record(CODE.DAMAGE_GRAVE,'Damage Check card did not reach graveyard as expected',{op:'playerDamage',amount:n,expected:expected.map(cardLite),def:def?.name||''});
          if(n>0&&safeNum(beforeLife)&&safeNum(Number(def?.life))){
            const expectedLife=lucky?beforeLife:beforeLife-n;
            if(Number(def.life)!==expectedLife)record(CODE.DAMAGE_LIFE,'life change does not match Damage Check result',{op:'playerDamage',amount:n,lucky,beforeLife,expectedLife,actualLife:Number(def.life),revealed:expected.map(cardLite)});
          }
          setTimeout(()=>validate('playerDamage',true),0);
        }catch(e){record(CODE.DAMAGE,'playerDamage audit failed',{op:'playerDamage'},e,true)}
        return r;
      };
      wrapped.__v0762DiagWrapped=true;wrapped.__v0762DiagOld=old;globalThis.playerDamage=wrapped;
    }catch(e){record(CODE.DAMAGE,'failed to install playerDamage audit',{op:'install'},e,true)}
  }

  function cardDbAudit(){
    const out={total:0,issues:[]};
    try{
      if(typeof CARD_DB==='undefined'||!CARD_DB||typeof CARD_DB!=='object'){out.issues.push('CARD_DB missing');return out}
      const vals=Object.values(CARD_DB);out.total=vals.length;const nos=new Set();
      vals.forEach((c,i)=>{
        if(!c||typeof c!=='object'){out.issues.push('invalid card entry #'+i);return}
        const no=String(c.no||'');if(!no)out.issues.push('card without number: '+(c.name||i));else if(nos.has(no))out.issues.push('duplicate card number: '+no);else nos.add(no);
        if(!c.name)out.issues.push(no+' name missing');if(!c.kind)out.issues.push(no+' kind missing');
        if(c.cost!=null&&!safeNum(Number(c.cost)))out.issues.push(no+' invalid cost');
      });
      out.issues.slice(0,20).forEach(m=>record(CODE.CARD_DB,m,{op:'cardDbAudit'},null,true));
    }catch(e){record(CODE.CARD_DB,'CARD_DB audit crashed',{op:'cardDbAudit'},e,true);out.issues.push(String(e))}
    return out;
  }

  function collectFailures(x,path,out,seen){
    if(x==null||typeof x!=='object')return;if(seen.has(x))return;seen.add(x);
    if(Array.isArray(x)){x.forEach((v,i)=>collectFailures(v,path+'['+i+']',out,seen));return}
    const status=String(x.status??x.result??'').toLowerCase();
    const bad=x.ok===false||x.pass===false||x.passed===false||['fail','failed','mismatch','error','ng'].includes(status);
    if(bad)out.push({path,id:x.id||x.no||x.cardNo||'',status:status||'failed',reason:x.reason||x.reasons||x.message||x.detail||''});
    Object.keys(x).forEach(k=>collectFailures(x[k],path?path+'.'+k:k,out,seen));
  }
  async function runOfficialAudit(){
    if(busyTest)return;busyTest=true;renderPanel();
    try{
      cardDbAudit();
      if(typeof v072RunBP01Tests==='function')await v072RunBP01Tests();
      else record(CODE.RULE_RUN,'official test runner is not available',{op:'v072RunBP01Tests'});
      let report=null;try{if(typeof v072BpReport!=='undefined')report=v072BpReport}catch(_e){}
      const fails=[];collectFailures(report,'report',fails,new WeakSet());
      fails.slice(0,30).forEach(f=>record(CODE.RULE,'official regression test failed: '+(f.id||f.path),{op:'officialAudit',failure:f},null));
      validate('officialAudit',true);
      try{localStorage.setItem('palworld_diag_last_official_v0762',JSON.stringify({at:new Date().toISOString(),qaTotal:OFFICIAL_QA_TOTAL,failCount:fails.length,report}))}catch(_e){}
      if(!fails.length)showInfoToast('✅ 公式回帰テスト：検出されたFAIL 0件');
      else showInfoToast('⚠ 公式回帰テスト：FAIL '+fails.length+'件');
    }catch(e){record(CODE.RULE_RUN,'official audit runner crashed',{op:'officialAudit'},e)}
    finally{busyTest=false;renderPanel()}
  }

  function showInfoToast(msg){
    try{
      let t=document.getElementById('v0762InfoToast');if(!t){t=document.createElement('div');t.id='v0762InfoToast';t.className='v0762ErrorToast';t.style.borderColor='#7fd0b4';t.style.background='#0b2b22f2';document.body.appendChild(t)}
      t.textContent=msg;t.hidden=false;setTimeout(()=>{if(t)t.hidden=true},3200);
    }catch(_e){}
  }
  function diagText(){
    const a=load();let last=null;try{last=JSON.parse(localStorage.getItem('palworld_diag_last_official_v0762')||'null')}catch(_e){}
    return JSON.stringify({appVersion:VERSION,generatedAt:new Date().toISOString(),officialQATotal:OFFICIAL_QA_TOTAL,officialCheckedAt:OFFICIAL_CHECKED_AT,lastOfficialAudit:last,errors:a,current:snapshot({op:'manualExport'})},null,2);
  }
  async function copyText(t){
    try{await navigator.clipboard.writeText(t);showInfoToast('診断ログをコピーしました');return}catch(_e){}
    try{const x=document.createElement('textarea');x.value=t;x.style.position='fixed';x.style.opacity='0';document.body.appendChild(x);x.select();document.execCommand('copy');x.remove();showInfoToast('診断ログをコピーしました')}catch(e){record(CODE.JS,'diagnostic copy failed',{op:'copy'},e,true)}
  }
  function clearLogs(){save([]);try{localStorage.removeItem('palworld_diag_last_official_v0762')}catch(_e){}syncButton();renderPanel();showInfoToast('診断ログを消去しました')}

  function syncButton(){
    try{
      const n=load().length;let b=document.getElementById('v0762DiagBtn');
      const title=document.querySelector('.v04Title');if(!title)return;
      if(!b){b=document.createElement('button');b.id='v0762DiagBtn';b.type='button';b.className='v0762DiagBtn';b.addEventListener('click',openPanel);title.insertAdjacentElement('afterend',b)}
      b.textContent=n?'診断 ⚠'+n:'診断 ✓';b.classList.toggle('hasError',n>0);
    }catch(_e){}
  }
  function esc(v){return String(v??'').replace(/[&<>\"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]))}
  function renderPanel(){
    const o=document.getElementById('v0762DiagOverlay');if(!o)return;
    const entries=load();let last=null;try{last=JSON.parse(localStorage.getItem('palworld_diag_last_official_v0762')||'null')}catch(_e){}
    let scenarioCount='?';try{if(typeof v0712ScenarioCases==='function')scenarioCount=String(v0712ScenarioCases().length)}catch(_e){}
    let db=cardDbAudit();
    const items=entries.slice(0,20).map(e=>'<div class="v0762DiagItem error"><div class="v0762DiagCode">'+esc(e.code)+'</div><div class="v0762DiagMsg">'+esc(e.message)+'</div><div class="v0762DiagMeta">'+esc(new Date(e.ts).toLocaleString())+' / '+esc(e.meta?.op||'')+' / '+esc(e.id)+'</div></div>').join('');
    o.innerHTML='<div class="v0762DiagPanel"><div class="v0762DiagHead"><div class="v0762DiagTitle">ルール監査・診断 v'+VERSION+'</div><button class="v0762DiagClose" data-act="close">閉じる</button></div>'+        '<div class="v0762DiagSummary"><div class="v0762DiagStat"><b>'+entries.length+'</b><span>保存エラー</span></div><div class="v0762DiagStat"><b>'+db.total+'</b><span>CARD_DB</span></div><div class="v0762DiagStat"><b>'+scenarioCount+'</b><span>回帰ケース</span></div><div class="v0762DiagStat"><b>'+OFFICIAL_QA_TOTAL+'</b><span>公式Q&A総数</span></div></div>'+        '<div class="v0762DiagActions"><button class="primary" data-act="official">'+(busyTest?'テスト実行中…':'公式テスト実行')+'</button><button data-act="state">現在状態を検査</button><button data-act="copy">診断ログをコピー</button><button data-act="clear">ログ消去</button></div>'+        '<div class="v0762DiagNote">自動監視：JavaScript例外、Promise失敗、ゾーン重複、無効な数値、Damage Checkの墓地移動・LIFE変化、主要処理の例外を監視します。公式Q&Aは現在97件。アプリ内の自動回帰ケースが97件すべてを個別再現しているわけではないため、未網羅分は「確認済み」とは扱いません。公式情報確認日：'+OFFICIAL_CHECKED_AT+'。</div>'+        '<div class="v0762DiagNote">前回公式テスト：'+esc(last?.at||'未実行')+' / 検出FAIL：'+esc(last?.failCount??'-')+'</div>'+        '<div class="v0762DiagList">'+(items||'<div class="v0762DiagItem"><div class="v0762DiagMsg">現在、保存されている処理エラーはありません。</div></div>')+'</div></div>';
    o.querySelector('[data-act="close"]')?.addEventListener('click',closePanel);
    o.querySelector('[data-act="official"]')?.addEventListener('click',runOfficialAudit);
    o.querySelector('[data-act="state"]')?.addEventListener('click',()=>{const ok=validate('manual',false);showInfoToast(ok?'✅ 現在状態：異常なし':'⚠ 現在状態：異常を記録しました');renderPanel()});
    o.querySelector('[data-act="copy"]')?.addEventListener('click',()=>copyText(diagText()));
    o.querySelector('[data-act="clear"]')?.addEventListener('click',clearLogs);
  }
  function openPanel(){
    let o=document.getElementById('v0762DiagOverlay');if(!o){o=document.createElement('div');o.id='v0762DiagOverlay';o.className='v0762DiagOverlay';document.body.appendChild(o)}
    o.hidden=false;renderPanel();
  }
  function closePanel(){const o=document.getElementById('v0762DiagOverlay');if(o)o.hidden=true}

  addEventListener('error',e=>{try{record(CODE.JS,e.message||'uncaught JavaScript error',{op:'window.error',file:e.filename||'',line:e.lineno||0,col:e.colno||0},e.error)}catch(_e){}});
  addEventListener('unhandledrejection',e=>{try{const r=e.reason;record(CODE.PROMISE,clean(r?.message||r||'unhandled promise rejection'),{op:'unhandledrejection'},r instanceof Error?r:null)}catch(_e){}});

  wrapPlayerDamage();
  wrap('resolveBattle',CODE.BATTLE);
  wrap('stateCheck',CODE.STATE);
  wrap('activateAbility',CODE.ABILITY);
  wrap('playFromHand',CODE.PLAY);
  wrap('chooseAssign',CODE.ASSIGN);
  wrap('v0713FlushAutos',CODE.CORE);
  wrap('finishTurn',CODE.CORE);

  function boot(){syncButton();validate('boot',true);cardDbAudit()}
  try{new MutationObserver(()=>requestAnimationFrame(syncButton)).observe(document.documentElement,{childList:true,subtree:true})}catch(_e){}
  addEventListener('pageshow',boot,{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closePanel()});
  boot();setTimeout(boot,500);setTimeout(boot,1600);
  console.info('Palworld OCG v0.7.67 rule audit + diagnostics applied');
})();
</script>


<style id="v0763FullSuiteStyle">
.v0763SuiteBox{border:1px solid #365e52!important;background:#091d18!important;border-radius:10px!important;padding:8px!important;margin:8px 0!important}
.v0763SuiteTitle{font-size:10px!important;font-weight:950!important;color:#fff4bd!important;margin-bottom:5px!important}
.v0763SuiteGrid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:5px!important}
.v0763SuiteCell{border:1px solid #29483f!important;background:#0d2720!important;border-radius:8px!important;padding:6px!important;text-align:center!important}
.v0763SuiteCell b{display:block!important;font-size:10px!important;color:#fff!important}.v0763SuiteCell span{display:block!important;font-size:6.5px!important;color:#aec7bf!important;margin-top:2px!important}
.v0763SuiteDetail{font-size:7px!important;line-height:1.4!important;color:#c5d7d1!important;margin-top:6px!important;white-space:pre-wrap!important;word-break:break-word!important}
.v0763SuiteBtns{display:flex!important;flex-wrap:wrap!important;gap:5px!important;margin-top:7px!important}
.v0763SuiteBtns button{border:1px solid #557c70!important;background:#102b23!important;color:#fff!important;border-radius:8px!important;padding:6px 9px!important;font-size:7px!important;font-weight:850!important}
.v0763SuiteBtns button.primary{border-color:#d7ba58!important;background:#483b0c!important;color:#fff7d2!important}
.v0763SuiteBtns button:disabled{opacity:.5!important}
@media(max-height:520px) and (orientation:landscape){.v0763SuiteBox{padding:5px!important;margin:5px 0!important}.v0763SuiteGrid{gap:3px!important}.v0763SuiteCell{padding:4px!important}.v0763SuiteBtns button{padding:4px 7px!important;font-size:6.5px!important}}
</style>
<script id="v0763FullSuiteScript">
(()=>{
  if(globalThis.__v0763FullSuiteApplied)return;
  globalThis.__v0763FullSuiteApplied=true;
  const VERSION='0.7.64', STORE='palworld_suite_v0763';
  let busy=false, queued=false;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function now(){return new Date().toISOString()}
  function load(){try{return JSON.parse(localStorage.getItem(STORE)||'null')}catch(_e){return null}}
  function save(v){try{localStorage.setItem(STORE,JSON.stringify(v))}catch(_e){};sync()}
  function diag(code,msg,meta,err){try{if(typeof palDiagRecord==='function')palDiagRecord(code,msg,meta||null,err||null,false)}catch(_e){}}
  function info(msg){try{let t=document.getElementById('v0763SuiteToast');if(!t){t=document.createElement('div');t.id='v0763SuiteToast';t.className='v0762ErrorToast';t.style.borderColor='#d7ba58';t.style.background='#332a0df3';document.body.appendChild(t)}t.textContent=msg;t.hidden=false;setTimeout(()=>{if(t)t.hidden=true},3500)}catch(_e){}}
  function safeJson(x){try{return JSON.parse(JSON.stringify(x,(k,v)=>typeof v==='function'?'[Function]':v))}catch(_e){return String(x)}}

  function scanResultTree(root){
    const out={total:0,ok:0,fail:0,error:0,unknown:0,failures:[]};
    const seen=new WeakSet();
    function walk(x,path){
      if(x==null||typeof x!=='object')return;
      if(seen.has(x))return;seen.add(x);
      if(Array.isArray(x)){x.forEach((v,i)=>walk(v,path+'['+i+']'));return}
      const hasSignal=('status' in x)||('ok' in x)||('pass' in x)||('passed' in x);
      if(hasSignal){
        out.total++;
        const s=String(x.status??x.result??'').toLowerCase();
        const bad=x.ok===false||x.pass===false||x.passed===false||['fail','failed','mismatch','error','ng'].includes(s);
        const good=x.ok===true||x.pass===true||x.passed===true||['ok','pass','passed','normal','success'].includes(s);
        if(bad){if(s==='error')out.error++;else out.fail++;out.failures.push({path,id:x.id||x.no||x.cardNo||'',status:s||'fail',reason:x.reason||x.reasons||x.message||x.detail||''})}
        else if(good)out.ok++; else out.unknown++;
      }
      Object.keys(x).forEach(k=>walk(x[k],path?path+'.'+k:k));
    }
    walk(root,'report');return out;
  }

  async function runScenario(){
    const started=performance.now();
    try{
      if(typeof v0712ScenarioCases!=='function')throw new Error('v0712ScenarioCases is not available');
      const cases=v0712ScenarioCases();
      if(!Array.isArray(cases)||!cases.length)throw new Error('scenario case list is empty');
      const results=[];
      for(let i=0;i<cases.length;i++){
        try{results.push(await cases[i]())}
        catch(e){results.push({id:'R?'+(i+1),status:'error',message:e?.message||String(e)})}
      }
      const c=scanResultTree(results);
      // Some scenario results may not expose a generic status shape. Fall back to common result fields.
      if(c.total===0){
        c.total=results.length;
        results.forEach((r,i)=>{
          const s=String(r?.status??r?.result??'').toLowerCase();
          if(['ok','pass','passed','normal','success'].includes(s)||r?.ok===true||r?.pass===true)c.ok++;
          else if(['error'].includes(s))c.error++;
          else if(['fail','failed','mismatch','ng'].includes(s)||r?.ok===false||r?.pass===false){c.fail++;c.failures.push({id:r?.id||'R'+(i+1),reason:r?.reason||r?.message||''})}
          else c.unknown++;
        });
      }
      const summary={kind:'scenario',at:now(),durationMs:Math.round((performance.now()-started)*10)/10,total:results.length,ok:c.ok,fail:c.fail,error:c.error,unknown:c.unknown,failures:c.failures.slice(0,30)};
      if(summary.fail||summary.error)diag('ERR-TEST-0101','公式裁定シナリオテストにFAIL/ERROR',{op:'scenario',summary});
      return summary;
    }catch(e){diag('ERR-TEST-0100','公式裁定シナリオテストを起動できません',{op:'scenario'},e);return {kind:'scenario',at:now(),durationMs:Math.round(performance.now()-started),total:0,ok:0,fail:0,error:1,unknown:0,message:e?.message||String(e)}}
  }

  async function runBp100(){
    const started=performance.now();
    try{
      if(typeof v072RunBP01Tests!=='function')throw new Error('v072RunBP01Tests is not available');
      await v072RunBP01Tests();
      let report=null;try{if(typeof v072BpReport!=='undefined')report=v072BpReport}catch(_e){}
      if(!report)throw new Error('v072BpReport was not produced');
      const c=scanResultTree(report);
      // Prefer explicit report counters when present.
      function num(...keys){for(const k of keys){const v=Number(report?.[k]);if(Number.isFinite(v))return v}return null}
      let total=num('total','count','completed','done');
      let ok=num('ok','normal','passed','passCount','success');
      let fail=num('fail','failed','mismatch','mismatches','failCount');
      let error=num('error','errors','errorCount');
      if(total==null||total<50) total=c.total||100;
      if(ok==null)ok=c.ok;
      if(fail==null)fail=c.fail;
      if(error==null)error=c.error;
      if((ok||0)+(fail||0)+(error||0)===0 && Array.isArray(report?.results)){
        total=report.results.length;const cc=scanResultTree(report.results);ok=cc.ok;fail=cc.fail;error=cc.error;
      }
      const summary={kind:'bp100',at:now(),durationMs:Math.round((performance.now()-started)*10)/10,total:Number(total||0),ok:Number(ok||0),fail:Number(fail||0),error:Number(error||0),unknown:Math.max(0,Number(total||0)-Number(ok||0)-Number(fail||0)-Number(error||0)),failures:c.failures.slice(0,30)};
      if(summary.fail||summary.error)diag('ERR-TEST-0201','BP01 100種単体テストにFAIL/ERROR',{op:'bp100',summary});
      return summary;
    }catch(e){diag('ERR-TEST-0200','BP01 100種単体テストを起動できません',{op:'bp100'},e);return {kind:'bp100',at:now(),durationMs:Math.round(performance.now()-started),total:0,ok:0,fail:0,error:1,unknown:0,message:e?.message||String(e)}}
  }

  function stressCandidates(){
    const arr=[];
    function add(name,fn,ctx){
      if(typeof fn!=='function')return;
      let src='';try{src=Function.prototype.toString.call(fn).slice(0,8000)}catch(_e){}
      let score=0;
      if(/stress/i.test(name))score+=5;if(/v077/i.test(name))score+=2;if(/run|start|begin|launch/i.test(name))score+=3;
      if(/v077Stress/.test(src))score+=3;if(/1000/.test(src))score+=2;if(/stress/i.test(src))score+=1;
      if(/setupCpuVsCpu/.test(name))score-=5;
      if(score>=5)arr.push({name,fn,ctx,score,len:fn.length});
    }
    try{Object.getOwnPropertyNames(globalThis).forEach(n=>{let v;try{v=globalThis[n]}catch(_e){return}add(n,v,globalThis)})}catch(_e){}
    try{const s=globalThis.v077Stress;if(s&&typeof s==='object')Object.keys(s).forEach(k=>add('v077Stress.'+k,s[k],s))}catch(_e){}
    arr.sort((a,b)=>b.score-a.score||a.len-b.len);return arr;
  }
  function stressSnapshot(){
    const out={};
    try{if(globalThis.v077Stress)out.v077Stress=safeJson(globalThis.v077Stress)}catch(_e){}
    try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/stress|v077/i.test(k||''))out[k]=localStorage.getItem(k)}}catch(_e){}
    return out;
  }
  function stressNumbers(x){
    const nums={completed:null,total:null,fail:null,error:null};const seen=new WeakSet();
    function walk(v){if(v==null||typeof v!=='object'||seen.has(v))return;seen.add(v);for(const [k,val] of Object.entries(v)){const kl=k.toLowerCase();if(typeof val==='number'&&Number.isFinite(val)){if(nums.completed==null&&/completed|complete|done|finished|games?done/.test(kl))nums.completed=val;if(nums.total==null&&/total|target|games?$|count$/.test(kl))nums.total=val;if(nums.fail==null&&/fail|mismatch|invalid/.test(kl))nums.fail=val;if(nums.error==null&&/error|exception|crash/.test(kl))nums.error=val}if(val&&typeof val==='object')walk(val)}}
    walk(x);return nums;
  }
  async function runStress1000(){
    const started=performance.now();
    try{
      const cand=stressCandidates();
      const c=cand.find(x=>x.len<=1);
      if(!c)throw new Error('1000戦ストレステストの安全に呼べるランナーを検出できません。候補: '+cand.slice(0,8).map(x=>x.name+'('+x.len+')').join(', '));
      let ret;
      try{ret=c.len===0?c.fn.call(c.ctx):c.fn.call(c.ctx,1000)}catch(e){throw new Error(c.name+' 起動失敗: '+(e?.message||e))}
      if(ret&&typeof ret.then==='function')await ret;
      // If the existing stress engine continues asynchronously, wait for active=false.
      const limit=Date.now()+300000;
      let everActive=false;
      while(Date.now()<limit){
        let active=false;try{active=!!globalThis.v077Stress?.active}catch(_e){}
        if(active)everActive=true;
        if(everActive&&!active)break;
        if(!everActive&&Date.now()-Math.round(performance.timeOrigin+started)>2500)break;
        await sleep(250);
      }
      let active=false;try{active=!!globalThis.v077Stress?.active}catch(_e){}
      if(active){diag('ERR-TEST-0302','1000戦ストレステストが5分以内に完了しませんでした',{op:'stress1000',runner:c.name});return {kind:'stress1000',at:now(),durationMs:Math.round(performance.now()-started),total:1000,ok:0,fail:0,error:1,unknown:1000,message:'timeout',runner:c.name}}
      const snap=stressSnapshot(), n=stressNumbers(snap);
      const completed=Number(n.completed??n.total??0);
      const fail=Number(n.fail||0), error=Number(n.error||0);
      const summary={kind:'stress1000',at:now(),durationMs:Math.round((performance.now()-started)*10)/10,total:1000,ok:completed>=1000&&!fail&&!error?1000:Math.min(1000,Math.max(0,completed-fail-error)),fail,error,unknown:completed>=1000?0:Math.max(0,1000-completed),completed,runner:c.name,candidates:cand.slice(0,10).map(x=>({name:x.name,score:x.score,args:x.len})),snapshot:snap};
      if(fail||error||completed<1000)diag('ERR-TEST-0301','1000戦ストレステスト結果に未完了/FAIL/ERROR',{op:'stress1000',summary:{completed,fail,error,runner:c.name}});
      return summary;
    }catch(e){const candidates=stressCandidates().slice(0,12).map(x=>({name:x.name,score:x.score,args:x.len}));diag('ERR-TEST-0300','1000戦ストレステストを起動できません',{op:'stress1000',candidates},e);return {kind:'stress1000',at:now(),durationMs:Math.round(performance.now()-started),total:1000,ok:0,fail:0,error:1,unknown:1000,message:e?.message||String(e),candidates}}
  }

  async function runOne(kind){
    if(busy)return;busy=true;sync();
    const all=load()||{version:VERSION,updatedAt:null};
    try{
      info(kind==='scenario'?'裁定22件を実行中…':kind==='bp100'?'BP01 100種を実行中…':'1000戦ストレスを実行中…');
      const r=kind==='scenario'?await runScenario():kind==='bp100'?await runBp100():await runStress1000();
      all.version=VERSION;all.updatedAt=now();all[kind]=r;save(all);
      info((r.fail||r.error)?'⚠ '+kind+'：要確認':'✅ '+kind+'：完了');
    }finally{busy=false;sync()}
  }
  async function runAll(){
    if(busy)return;busy=true;sync();
    const all={version:VERSION,startedAt:now(),updatedAt:null};
    try{
      info('全検査：裁定22件 → BP01 100種 → 1000戦');
      all.scenario=await runScenario();save({...all,updatedAt:now()});
      all.bp100=await runBp100();save({...all,updatedAt:now()});
      all.stress1000=await runStress1000();all.updatedAt=now();all.finishedAt=now();save(all);
      const bad=[all.scenario,all.bp100,all.stress1000].some(r=>(r?.fail||0)>0||(r?.error||0)>0||(r?.unknown||0)>0);
      info(bad?'⚠ 全検査完了：要確認項目あり':'✅ 全検査完了：全項目PASS');
    }finally{busy=false;sync()}
  }
  function reportText(){
    const r=load();
    return 'Palworld OCG 全検査レポート\nApp v'+VERSION+'\n日時: '+new Date().toLocaleString()+'\n\n'+JSON.stringify(r,null,2);
  }
  async function copyReport(){
    const t=reportText();
    try{await navigator.clipboard.writeText(t);info('全検査レポートをコピーしました');return}catch(_e){}
    try{const x=document.createElement('textarea');x.value=t;x.style.position='fixed';x.style.opacity='0';document.body.appendChild(x);x.select();document.execCommand('copy');x.remove();info('全検査レポートをコピーしました')}catch(e){diag('ERR-TEST-0001','全検査レポートのコピーに失敗',{op:'copySuite'},e)}
  }
  function fmt(r){if(!r)return '未実行';if(r.error&&r.total===0)return '起動エラー';return (r.ok||0)+'/'+(r.total||0)+(r.fail?' F'+r.fail:'')+(r.error?' E'+r.error:'')+(r.unknown?' ?'+r.unknown:'')}
  function detail(r){
    if(!r)return '';
    let x='時間 '+(r.durationMs??'-')+'ms';if(r.runner)x+=' / runner '+r.runner;if(r.completed!=null)x+=' / 完了 '+r.completed;
    if(r.message)x+=' / '+r.message;return x;
  }
  function augment(){
    const panel=document.querySelector('#v0762DiagOverlay .v0762DiagPanel');if(!panel)return;
    const actions=panel.querySelector('.v0762DiagActions');if(!actions)return;
    // Clarify what the original button actually invokes.
    const old=actions.querySelector('[data-act="official"]');if(old&&!busy)old.textContent='BP01 100種テスト';
    let box=panel.querySelector('.v0763SuiteBox');
    if(!box){box=document.createElement('div');box.className='v0763SuiteBox';actions.insertAdjacentElement('afterend',box)}
    const r=load()||{};
    box.innerHTML='<div class="v0763SuiteTitle">全検査 v'+VERSION+'</div><div class="v0763SuiteGrid">'+
      '<div class="v0763SuiteCell"><b>'+fmt(r.scenario)+'</b><span>裁定シナリオ</span></div>'+
      '<div class="v0763SuiteCell"><b>'+fmt(r.bp100)+'</b><span>BP01 100種</span></div>'+
      '<div class="v0763SuiteCell"><b>'+fmt(r.stress1000)+'</b><span>1000戦ストレス</span></div>'+
      '<div class="v0763SuiteCell"><b>'+((typeof palValidateState==='function'&&palValidateState('suiteView',true))?'OK':'要確認')+'</b><span>現在状態</span></div></div>'+
      '<div class="v0763SuiteDetail">'+[detail(r.scenario),detail(r.bp100),detail(r.stress1000)].filter(Boolean).join('\n')+'</div>'+
      '<div class="v0763SuiteBtns"><button data-suite="scenario">裁定22件</button><button data-suite="bp100">BP01 100種</button><button data-suite="stress1000">1000戦</button><button class="primary" data-suite="all">全検査</button><button data-suite="copy">結果コピー</button></div>';
    box.querySelectorAll('button').forEach(b=>b.disabled=busy);
    box.querySelector('[data-suite="scenario"]')?.addEventListener('click',()=>runOne('scenario'));
    box.querySelector('[data-suite="bp100"]')?.addEventListener('click',()=>runOne('bp100'));
    box.querySelector('[data-suite="stress1000"]')?.addEventListener('click',()=>runOne('stress1000'));
    box.querySelector('[data-suite="all"]')?.addEventListener('click',runAll);
    box.querySelector('[data-suite="copy"]')?.addEventListener('click',copyReport);
  }
  function sync(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;augment()})}
  try{new MutationObserver(sync).observe(document.documentElement,{childList:true,subtree:true})}catch(_e){}
  document.addEventListener('pointerup',()=>setTimeout(sync,0),{passive:true});
  globalThis.palRunScenarioTests=()=>runOne('scenario');
  globalThis.palRunBp100Tests=()=>runOne('bp100');
  globalThis.palRunStress1000=()=>runOne('stress1000');
  globalThis.palRunFullSuite=runAll;
  globalThis.palCopyFullSuiteReport=copyReport;
  sync();setTimeout(sync,600);setTimeout(sync,1800);
  console.info('Palworld OCG v0.7.67 full test suite applied');
})();
</script>


<style id="v0764TierDeckGuardStyle">
.v0764TierGuardStatus{margin-top:6px!important;border:1px solid #456f63!important;background:#0b211b!important;border-radius:8px!important;padding:6px!important;font-size:7px!important;line-height:1.45!important;color:#d9e8e2!important;white-space:pre-wrap!important}
.v0764TierGuardStatus b{color:#fff1a9!important}
.v0764TierGuardOk{color:#83e7b6!important}.v0764TierGuardBad{color:#ff9d96!important}
</style>
<script id="v0764TierDeckGuardScript">
(()=>{
  if(globalThis.__v0764TierDeckGuardApplied)return;
  globalThis.__v0764TierDeckGuardApplied=true;
  const VERSION='0.7.64';
  const STORE='palworld_tier_deck_guard_v0764';
  const tierFingerprints=new Set();
  let tierDepth=0,tierUiUntil=0,scanQueued=false,wrapping=false;
  const baseStorageSet=Storage.prototype.setItem;

  function clean(v){return String(v==null?'':v).replace(/\s+/g,' ').trim()}
  function now(){return Date.now()}
  function tierActive(){return tierDepth>0||now()<tierUiUntil}
  function isTierText(v){return /(?:Tier|tier|世代|候補|新候補|Elo|進化|generation|evolution|research|league|rank)/i.test(String(v||''))}
  function toast(msg,bad){
    try{
      let t=document.getElementById('v0764TierGuardToast');
      if(!t){t=document.createElement('div');t.id='v0764TierGuardToast';t.className='v0762ErrorToast';document.body.appendChild(t)}
      t.style.borderColor=bad?'#e2736d':'#d7ba58';t.style.background=bad?'#421613f2':'#332a0df3';
      t.textContent=msg;t.hidden=false;clearTimeout(t.__timer);t.__timer=setTimeout(()=>{if(t)t.hidden=true},4200);
    }catch(_e){}
  }
  function diag(code,msg,meta,err){
    try{if(typeof palDiagRecord==='function')palDiagRecord(code,msg,Object.assign({op:'tierDeckGuard',version:VERSION},meta||{}),err||null,false);else console.error(code,msg,meta||'',err||'')}catch(_e){}
  }
  function loadLog(){try{const x=JSON.parse(localStorage.getItem(STORE)||'{}');return x&&typeof x==='object'?x:{}}catch(_e){return {}}}
  function saveLog(x){try{baseStorageSet.call(localStorage,STORE,JSON.stringify(x))}catch(_e){}}
  function addLog(type,data){
    const x=loadLog();if(!Array.isArray(x.entries))x.entries=[];
    x.version=VERSION;x.updatedAt=new Date().toISOString();
    x.entries.unshift(Object.assign({time:new Date().toISOString(),type:type},data||{}));
    x.entries=x.entries.slice(0,80);
    x.repaired=x.entries.filter(e=>e.type==='repaired').length;
    x.errors=x.entries.filter(e=>e.type==='error').length;
    saveLog(x);return x;
  }
  function cardDef(no){
    try{return globalThis.CARD_DB?.[no]||globalThis.BP01_BY_NO?.[no]||null}catch(_e){return null}
  }
  function allCardDefs(){
    const m=new Map();
    try{Object.values(globalThis.CARD_DB||{}).forEach(c=>{if(c?.no)m.set(String(c.no),c)})}catch(_e){}
    try{Object.values(globalThis.BP01_BY_NO||{}).forEach(c=>{if(c?.no&&!m.has(String(c.no)))m.set(String(c.no),c)})}catch(_e){}
    return [...m.values()];
  }
  function looksCounts(x){
    if(!x||typeof x!=='object'||Array.isArray(x))return false;
    const es=Object.entries(x);if(!es.length)return false;
    let seen=0;
    for(const [k,v] of es){if(/^(?:TD|BP|EBP)\d{2}-\d{3}$/i.test(k)&&Number.isFinite(Number(v)))seen++}
    return seen>0&&seen>=Math.max(1,Math.floor(es.length*.6));
  }
  function refOf(deck){
    if(!deck||typeof deck!=='object')return null;
    if(deck.cards&&looksCounts(deck.cards)){
      return {kind:'cards',deck:deck,counts:Object.fromEntries(Object.entries(deck.cards).map(([k,v])=>[k,Math.max(0,Math.floor(Number(v)||0))]))};
    }
    if(Array.isArray(deck.main)){
      const counts={};
      for(const row of deck.main){
        if(Array.isArray(row)){const no=String(row[0]||'');let n=Number(row.length>2?row[2]:row[1]);if(cardDef(no)&&Number.isFinite(n)&&n>0)counts[no]=(counts[no]||0)+Math.floor(n)}
        else if(row&&typeof row==='object'){const no=String(row.no||row.cardNo||'');const n=Number(row.count??row.qty??row.n??1);if(cardDef(no)&&Number.isFinite(n)&&n>0)counts[no]=(counts[no]||0)+Math.floor(n)}
      }
      if(Object.keys(counts).length)return {kind:'main',deck:deck,counts:counts};
    }
    if(looksCounts(deck))return {kind:'raw',deck:deck,counts:Object.fromEntries(Object.entries(deck).map(([k,v])=>[k,Math.max(0,Math.floor(Number(v)||0))]))};
    return null;
  }
  function commit(ref,counts){
    if(!ref)return false;
    if(ref.kind==='cards'||ref.kind==='raw'){
      const dst=ref.kind==='cards'?ref.deck.cards:ref.deck;
      Object.keys(dst).forEach(k=>{if(/^(?:TD|BP|EBP)\d{2}-\d{3}$/i.test(k))delete dst[k]});
      Object.entries(counts).forEach(([no,n])=>{if(n>0)dst[no]=n});return true;
    }
    if(ref.kind==='main'){
      const old=new Map();ref.deck.main.forEach(r=>{const no=Array.isArray(r)?String(r[0]||''):String(r?.no||r?.cardNo||'');if(no)old.set(no,r)});
      ref.deck.main=Object.entries(counts).filter(([,n])=>n>0).sort(([a],[b])=>a.localeCompare(b)).map(([no,n])=>{
        const r=old.get(no),d=cardDef(no);
        if(Array.isArray(r)){const z=r.slice();if(z.length<3)return [no,d?.name||no,n];z[0]=no;z[1]=typeof z[1]==='string'?z[1]:(d?.name||no);z[2]=n;return z}
        if(r&&typeof r==='object'){const z=Object.assign({},r);z.no=z.no||no;if('count'in z)z.count=n;else if('qty'in z)z.qty=n;else if('n'in z)z.n=n;else z.count=n;return z}
        return [no,d?.name||no,n];
      });return true;
    }
    return false;
  }
  function fingerprint(counts){return Object.entries(counts||{}).filter(([,n])=>Number(n)>0).sort(([a],[b])=>a.localeCompare(b)).map(([no,n])=>no+':'+Number(n)).join('|')}
  function auditCounts(counts){
    const st={total:0,lucky:0,colors:[],sameNameOver:[],unknown:[],errors:[]};const colors=new Set(),names={};
    for(const [no,n0] of Object.entries(counts||{})){
      const n=Math.max(0,Math.floor(Number(n0)||0));if(!n)continue;st.total+=n;
      const c=cardDef(no);if(!c){st.unknown.push(no);continue}
      if(c.lucky)st.lucky+=n;
      if(c.color&&c.color!=='colorless')colors.add(String(c.color));
      const nm=String(c.name||no);names[nm]=(names[nm]||0)+n;
    }
    st.colors=[...colors];st.sameNameOver=Object.entries(names).filter(([,n])=>n>4);
    if(st.total!==50)st.errors.push('メインデッキ50枚（現在'+st.total+'枚）');
    if(st.colors.length>2)st.errors.push('色は最大2色（現在'+st.colors.length+'色）');
    if(st.sameNameOver.length)st.errors.push('同名4枚超過: '+st.sameNameOver[0][0]+' '+st.sameNameOver[0][1]+'枚');
    if(st.lucky>8)st.errors.push('Luckyは8枚まで（現在'+st.lucky+'枚）');
    if(st.unknown.length)st.errors.push('未登録カード: '+st.unknown.slice(0,4).join(','));
    st.ok=!st.errors.length;return st;
  }
  function nameCounts(counts){const m={};Object.entries(counts).forEach(([no,n])=>{const c=cardDef(no);if(c&&n>0){const nm=String(c.name||no);m[nm]=(m[nm]||0)+Number(n)}});return m}
  function repairLucky(counts){
    const before=auditCounts(counts);if(before.lucky<=8)return {ok:before.ok,changed:false,counts:counts,before:before,after:before,removed:[],added:[]};
    if(before.total!==50||before.colors.length>2||before.sameNameOver.length||before.unknown.length)return {ok:false,changed:false,counts:counts,before:before,after:before,reason:'Lucky以外にもルール違反があるため自動修復しません'};
    const out=Object.assign({},counts),removed=[],added=[];let need=before.lucky-8;
    const luckyRows=Object.entries(out).filter(([no,n])=>n>0&&cardDef(no)?.lucky).sort((a,b)=>Number(b[1])-Number(a[1])||String(b[0]).localeCompare(String(a[0])));
    for(const [no] of luckyRows){while(need>0&&out[no]>0){out[no]--;need--;removed.push(no)}if(out[no]<=0)delete out[no];if(need<=0)break}
    if(need>0)return {ok:false,changed:false,counts:counts,before:before,after:auditCounts(out),reason:'Lucky超過分を除去できませんでした'};
    let fill=removed.length;const allowed=new Set(before.colors);allowed.add('colorless');
    const pool=allCardDefs().filter(c=>c&&c.no&&!c.lucky&&c.catalogOnly!==true&&(allowed.has(String(c.color||'colorless')))).sort((a,b)=>{
      const ae=out[a.no]>0?0:1,be=out[b.no]>0?0:1;if(ae!==be)return ae-be;
      const ac=Number(out[a.no]||0),bc=Number(out[b.no]||0);if(ac!==bc)return bc-ac;
      return String(a.no).localeCompare(String(b.no));
    });
    let guard=0;
    while(fill>0&&guard++<200){
      let chosen=null;const names=nameCounts(out);
      for(const c of pool){const cur=Number(out[c.no]||0);const nm=String(c.name||c.no);if(cur>=4)continue;if((names[nm]||0)>=4)continue;chosen=c;break}
      if(!chosen)break;out[chosen.no]=Number(out[chosen.no]||0)+1;added.push(chosen.no);fill--;
      pool.sort((a,b)=>{const ae=out[a.no]>0?0:1,be=out[b.no]>0?0:1;if(ae!==be)return ae-be;const ac=Number(out[a.no]||0),bc=Number(out[b.no]||0);if(ac!==bc)return bc-ac;return String(a.no).localeCompare(String(b.no))});
    }
    const after=auditCounts(out);return {ok:fill===0&&after.ok,changed:fill===0,counts:out,before:before,after:after,removed:removed,added:added,reason:fill?'交換先カードが不足しました':''};
  }
  function deckLabel(deck,key){return clean(deck?.name||deck?.title||deck?.label||key||'Tier候補')}
  function ensureDeck(deck,key,context,forceTier){
    const ref=refOf(deck);if(!ref)return {skipped:true,ok:true};
    const label=deckLabel(deck,key);const beforeFp=fingerprint(ref.counts);if(isTierText(label)||forceTier)tierFingerprints.add(beforeFp);
    const st=auditCounts(ref.counts);if(st.ok){if(isTierText(label)||forceTier)tierFingerprints.add(beforeFp);return {ok:true,changed:false,stats:st,label:label}}
    const isTier=!!forceTier||isTierText(label)||isTierText(key)||tierActive()||tierFingerprints.has(beforeFp);
    if(!isTier)return {ok:false,changed:false,stats:st,label:label,nonTier:true};
    if(st.lucky>8){
      const rr=repairLucky(ref.counts);
      if(rr.ok&&rr.changed&&commit(ref,rr.counts)){
        const afterFp=fingerprint(rr.counts);tierFingerprints.add(beforeFp);tierFingerprints.add(afterFp);
        addLog('repaired',{label:label,key:String(key||''),context:String(context||''),beforeLucky:st.lucky,afterLucky:rr.after.lucky,removed:rr.removed,added:rr.added});
        console.warn('[v0.7.67] Tier deck auto-repaired',label,'Lucky',st.lucky,'->',rr.after.lucky,rr.removed,rr.added);
        toast('Tier候補を自動調整: Lucky '+st.lucky+'→'+rr.after.lucky+'枚',false);
        return {ok:true,changed:true,stats:rr.after,label:label,removed:rr.removed,added:rr.added};
      }
    }
    const code='ERR-TIER-DECK-0201';
    const msg=label+' がデッキルール違反: '+st.errors.join(' / ');
    addLog('error',{code:code,label:label,key:String(key||''),context:String(context||''),errors:st.errors,stats:st});diag(code,msg,{label:label,key:key||'',context:context||'',stats:st});toast(code+' '+msg,true);
    return {ok:false,changed:false,stats:st,label:label,code:code};
  }
  function walkTierObject(root,context,forceTier,seen,depth){
    if(!root||typeof root!=='object'||depth>6)return {changed:0,errors:0,checked:0};
    seen=seen||new WeakSet();if(seen.has(root))return {changed:0,errors:0,checked:0};seen.add(root);
    let out={changed:0,errors:0,checked:0};
    const ref=refOf(root);
    if(ref){const r=ensureDeck(root,'',context,forceTier);out.checked++;if(r.changed)out.changed++;if(!r.ok&&!r.nonTier)out.errors++}
    const keys=Object.keys(root).slice(0,300);
    for(const k of keys){
      let v;try{v=root[k]}catch(_e){continue}if(!v||typeof v!=='object')continue;
      const childForce=forceTier||isTierText(k)||isTierText(root?.name||root?.title||root?.label||'');
      const r=walkTierObject(v,context+'.'+k,childForce,seen,depth+1);out.changed+=r.changed;out.errors+=r.errors;out.checked+=r.checked;
    }
    return out;
  }
  function scanDeckRegistry(context){
    let out={changed:0,errors:0,checked:0};
    try{for(const [k,d] of Object.entries(globalThis.DECKS||{})){if(!isTierText(k)&&!isTierText(d?.name))continue;const r=ensureDeck(d,k,context||'DECKS',true);out.checked++;if(r.changed)out.changed++;if(!r.ok)out.errors++}}catch(e){diag('ERR-TIER-DECK-0901','DECKS監査中に例外',{context:context||''},e)}
    return out;
  }
  function scanGlobals(context){
    let out={changed:0,errors:0,checked:0};
    const names=Object.getOwnPropertyNames(globalThis).filter(n=>isTierText(n)&&!/^__v0764/.test(n)).slice(0,120);
    for(const n of names){let v;try{v=globalThis[n]}catch(_e){continue}if(!v||typeof v!=='object')continue;const r=walkTierObject(v,'global.'+n,true,new WeakSet(),0);out.changed+=r.changed;out.errors+=r.errors;out.checked+=r.checked}
    return out;
  }
  function tierStorageKey(k,v){return /tier|generation|evolution|research|league|elo|rank/i.test(String(k||''))||(/(?:Tier|世代|候補|Elo)/.test(String(v||''))&&/cards|main/.test(String(v||'')))}
  function repairJsonText(k,v,context){
    if(!tierStorageKey(k,v))return {value:v,changed:0,errors:0,checked:0};
    let obj;try{obj=JSON.parse(v)}catch(_e){return {value:v,changed:0,errors:0,checked:0}}if(!obj||typeof obj!=='object')return {value:v,changed:0,errors:0,checked:0};
    const r=walkTierObject(obj,context||('storage.'+k),true,new WeakSet(),0);return {value:r.changed?JSON.stringify(obj):v,changed:r.changed,errors:r.errors,checked:r.checked};
  }
  function scanStorage(context){
    let out={changed:0,errors:0,checked:0};
    try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||k===STORE)continue;const v=localStorage.getItem(k);if(!tierStorageKey(k,v))continue;const r=repairJsonText(k,v,context||('storage.'+k));out.changed+=r.changed;out.errors+=r.errors;out.checked+=r.checked;if(r.changed&&!r.errors)baseStorageSet.call(localStorage,k,r.value)}}catch(e){diag('ERR-TIER-DECK-0902','Tier履歴監査中に例外',{context:context||''},e)}
    return out;
  }
  function scanSavedTierDecks(context){
    let out={changed:0,errors:0,checked:0};
    try{const arr=globalThis.v047SavedDecks;if(Array.isArray(arr)){for(const d of arr){if(!isTierText(d?.name))continue;const r=ensureDeck(d,d?.id||'',context||'savedTier',true);out.checked++;if(r.changed)out.changed++;if(!r.ok)out.errors++}}}catch(_e){}
    return out;
  }
  function auditAll(context){
    const rs=[scanDeckRegistry(context),scanSavedTierDecks(context),scanGlobals(context),scanStorage(context)];
    const out=rs.reduce((a,r)=>({changed:a.changed+r.changed,errors:a.errors+r.errors,checked:a.checked+r.checked}),{changed:0,errors:0,checked:0});
    const x=loadLog();x.lastAudit={time:new Date().toISOString(),context:String(context||''),checked:out.checked,repaired:out.changed,errors:out.errors};saveLog(x);syncPanel();return out;
  }
  function guardKey(k,context){
    try{const d=globalThis.DECKS?.[k];if(!d)return true;const tier=isTierText(k)||isTierText(d?.name)||tierActive();if(!tier)return true;const r=ensureDeck(d,k,context,true);if(!r.ok)throw new Error('['+(r.code||'ERR-TIER-DECK-0201')+'] '+r.label+' は合法デッキではありません');return true}catch(e){if(/ERR-TIER-DECK/.test(String(e?.message||'')))throw e;diag('ERR-TIER-DECK-0202','Tier対戦開始前のデッキ監査に失敗',{key:k,context:context||''},e);throw e}
  }
  function wrapSetup(name){
    try{const old=globalThis[name];if(typeof old!=='function'||old.__v0764TierGuard)return;
      const w=function(){const args=[...arguments];args.forEach(a=>{if(typeof a==='string'&&globalThis.DECKS?.[a])guardKey(a,name)});return old.apply(this,arguments)};
      w.__v0764TierGuard=true;w.__v0764TierOld=old;globalThis[name]=w;
    }catch(_e){}
  }
  function patchValidate(){
    try{const old=globalThis.v047Validate;if(typeof old!=='function'||old.__v0764TierGuard)return;
      const w=function(cards){
        const ref=refOf(cards);const fp=ref?fingerprint(ref.counts):'';
        if(ref&&(tierActive()||tierFingerprints.has(fp))){const holder=looksCounts(cards)?cards:{cards:cards};const r=ensureDeck(holder,'Tier copy','v047Validate',true);if(!r.ok){return {ok:false,count:r.stats?.total||0,colors:r.stats?.colors||[],errors:r.stats?.errors||['Tierデッキルール違反']}}}
        const res=old.apply(this,arguments);
        try{const rr=refOf(cards);if(rr){const st=auditCounts(rr.counts);if(st.lucky>8){res.ok=false;res.errors=Array.isArray(res.errors)?res.errors:[];if(!res.errors.some(x=>/Lucky|ラッキー/.test(String(x))))res.errors.push('ラッキーアイコンを持つカードは8枚まで（現在'+st.lucky+'枚）')}}}catch(_e){}
        return res;
      };w.__v0764TierGuard=true;w.__v0764TierOld=old;globalThis.v047Validate=w;
    }catch(_e){}
  }
  function patchPersist(){
    try{const old=globalThis.v047Persist;if(typeof old!=='function'||old.__v0764TierGuard)return;
      const w=function(){const r=scanSavedTierDecks('v047Persist');if(r.errors){diag('ERR-TIER-DECK-0301','違反Tierデッキの保存を停止',{errors:r.errors});return false}return old.apply(this,arguments)};w.__v0764TierGuard=true;w.__v0764TierOld=old;globalThis.v047Persist=w;
    }catch(_e){}
  }
  function tierFnSource(src){return /(?:Tier表|Tier研究|世代進化|Elo|新候補|生存デッキ調整|デッキ一覧[^\n]{0,80}コピー)/i.test(src)}
  function wrapTierFunctions(){
    if(wrapping)return;wrapping=true;
    try{
      for(const n of Object.getOwnPropertyNames(globalThis)){
        if(/^__v0764/.test(n))continue;let fn;try{fn=globalThis[n]}catch(_e){continue}if(typeof fn!=='function'||fn.__v0764TierFunction)continue;
        let src='';try{src=Function.prototype.toString.call(fn)}catch(_e){}if(!tierFnSource(src))continue;
        const w=function(){tierDepth++;try{[...arguments].forEach((a,i)=>{if(a&&typeof a==='object')walkTierObject(a,n+'.arg'+i,true,new WeakSet(),0)});const r=fn.apply(this,arguments);if(r&&typeof r.then==='function')return r.finally(()=>{tierDepth=Math.max(0,tierDepth-1);setTimeout(()=>auditAll(n+'.after'),0)});tierDepth=Math.max(0,tierDepth-1);setTimeout(()=>auditAll(n+'.after'),0);return r}catch(e){tierDepth=Math.max(0,tierDepth-1);throw e}};
        w.__v0764TierFunction=true;w.__v0764TierOld=fn;globalThis[n]=w;
      }
    }finally{wrapping=false}
  }
  function patchStorage(){
    if(Storage.prototype.setItem.__v0764TierGuard)return;
    const w=function(k,v){
      try{if(this===localStorage&&k!==STORE&&tierStorageKey(k,v)){const r=repairJsonText(k,String(v),'setItem.'+k);if(r.errors){diag('ERR-TIER-DECK-0302','違反Tier履歴の保存を停止',{key:k,errors:r.errors});toast('ERR-TIER-DECK-0302 違反Tier結果の保存を停止',true);return}if(r.changed)v=r.value}}
      catch(e){diag('ERR-TIER-DECK-0903','Tier保存前監査に失敗',{key:String(k||'')},e)}
      return baseStorageSet.call(this,k,v);
    };w.__v0764TierGuard=true;Storage.prototype.setItem=w;
  }
  function syncPanel(){
    try{
      const panel=document.querySelector('#v0762DiagOverlay .v0762DiagPanel');if(!panel)return;const actions=panel.querySelector('.v0762DiagActions');if(!actions)return;
      let b=actions.querySelector('[data-act="tierguard"]');if(!b){b=document.createElement('button');b.dataset.act='tierguard';b.textContent='Tierデッキ検査';b.addEventListener('click',()=>{const r=auditAll('manualTierAudit');toast(r.errors?'Tier検査: '+r.errors+'件の違反':'Tier検査OK / 修復 '+r.changed+'件',!!r.errors)});actions.appendChild(b)}
      let s=panel.querySelector('.v0764TierGuardStatus');if(!s){s=document.createElement('div');s.className='v0764TierGuardStatus';const box=panel.querySelector('.v0763SuiteBox');(box||actions).insertAdjacentElement('afterend',s)}
      const x=loadLog(),a=x.lastAudit||{};s.innerHTML='<b>Tierデッキ合法性ガード v'+VERSION+'</b>\n'+
        '<span class="'+((a.errors||0)?'v0764TierGuardBad':'v0764TierGuardOk')+'">直近検査: '+(a.checked??'-')+'件 / 自動修復 '+(a.repaired??0)+' / 未修復 '+(a.errors??0)+'</span>\n'+
        'Lucky上限: 8枚 / Tier候補のみ自動修復';
    }catch(_e){}
  }
  function install(){wrapSetup('setupCpuVsCpu');wrapSetup('setupGame');patchValidate();patchPersist();patchStorage();wrapTierFunctions();auditAll('boot');syncPanel()}
  document.addEventListener('click',e=>{try{const el=e.target?.closest?.('button,[role="button"]');if(!el)return;const tx=clean(el.textContent||'');const near=clean(el.closest?.('.modalCard,.v060Panel,.v0762DiagPanel,section,main')?.textContent||'');if((/コピー|対戦|研究|進化|生成/.test(tx)&&isTierText(near))||isTierText(tx)){tierUiUntil=now()+2200;setTimeout(()=>auditAll('tierUiClick'),0)}}catch(_e){}},true);
  try{new MutationObserver(()=>{if(scanQueued)return;scanQueued=true;requestAnimationFrame(()=>{scanQueued=false;wrapTierFunctions();wrapSetup('setupCpuVsCpu');patchValidate();patchPersist();syncPanel()})}).observe(document.documentElement,{childList:true,subtree:true})}catch(_e){}
  addEventListener('pageshow',()=>setTimeout(install,80),{passive:true});
  globalThis.palAuditTierDecks=()=>auditAll('manualApi');
  globalThis.palTierDeckGuardStatus=()=>loadLog();
  install();setTimeout(install,700);setTimeout(()=>{wrapTierFunctions();auditAll('lateBoot')},2200);
  console.info('Palworld OCG v0.7.67 Tier legal-deck guard applied');
})();
</script>



<style id="v0772IntegratedBattleCoreStyle">
#v0772CoreError{position:fixed;left:50%;top:8px;transform:translateX(-50%);z-index:2147483646;background:#6b1018;color:white;border:1px solid #ff7780;border-radius:10px;padding:7px 12px;font:800 11px/1.35 sans-serif;box-shadow:0 6px 24px #0008;max-width:90vw;text-align:center}
#v0772AttackLayer{position:fixed;inset:0;z-index:2147482500;pointer-events:none;overflow:hidden}
#v0772AttackLayer svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.v0772AttackRing{position:fixed;border:4px solid #ffd95b;border-radius:14px;box-shadow:0 0 0 3px #0009,0 0 22px #ffd95bcc;animation:v0772Pulse .7s ease-in-out infinite alternate}
.v0772AttackRing.target{border-color:#ff6f62;box-shadow:0 0 0 3px #0009,0 0 24px #ff6f62cc}
#v0772AttackLabel{position:fixed;left:50%;top:11%;transform:translateX(-50%);background:#10151deF;border:2px solid #ffd95b;border-radius:14px;color:#fff;padding:8px 14px;font:900 15px/1.25 sans-serif;max-width:82vw;text-align:center;box-shadow:0 10px 28px #000b}
@keyframes v0772Pulse{from{filter:brightness(.9);transform:scale(.99)}to{filter:brightness(1.25);transform:scale(1.02)}}
#v0772DamageOverlay{position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;background:#0008;pointer-events:none;padding:10px}
#v0772DamageOverlay[hidden]{display:none!important}
.v0772DamageBox{width:min(470px,86vw);max-height:92vh;overflow:hidden;background:linear-gradient(180deg,#123529,#091713);border:2px solid #e7ca68;border-radius:20px;color:#fff;text-align:center;padding:12px 18px 14px;box-shadow:0 18px 48px #000c}
.v0772DamageHead{font:1000 18px/1.15 sans-serif;letter-spacing:.08em;color:#f5df8d}.v0772DamageWho{font:800 10px/1.25 sans-serif;opacity:.9;margin-top:3px}.v0772DamageCount{font:800 10px/1.2 sans-serif;color:#d8ddeb;margin-top:4px}
.v0772DamageStage{height:min(260px,48vh);display:flex;align-items:center;justify-content:center;margin:8px 0}.v0772DamageStage img{display:block!important;max-height:100%!important;max-width:190px!important;width:auto!important;height:auto!important;object-fit:contain!important;filter:drop-shadow(0 8px 14px #0009)}
.v0772DamageStage .card{width:145px!important;height:205px!important;transform:none!important;pointer-events:none!important}.v0772DamageName{font:900 14px/1.25 sans-serif}.v0772DamageLucky{margin-top:5px;font:1000 17px/1.15 sans-serif;color:#ffe45f}.v0772DamageNormal{margin-top:5px;font:800 10px/1.2 sans-serif;color:#cfe8dd}
@media (max-height:520px) and (orientation:landscape){#v0772AttackLabel{top:7%;font-size:12px;padding:6px 10px}.v0772DamageBox{width:min(390px,80vw);padding:8px 14px}.v0772DamageHead{font-size:14px}.v0772DamageStage{height:min(190px,44vh);margin:5px 0}.v0772DamageStage img{max-width:135px!important}.v0772DamageName{font-size:11px}.v0772DamageLucky{font-size:13px}}
</style>
<script id="v0772IntegratedBattleCoreScript">
(()=>{
  if(globalThis.__v0772IntegratedCoreApplied)return;globalThis.__v0772IntegratedCoreApplied=true;
  const SPEED_KEY='palworld_cpu_speed_v0769';
  let resumeKey='',nextCpuAt=0,busyUntil=0,attackTimer=0,damageTimer=0,damageQueue=[],damageShowing=false,cpuGateTurn='';
  const esc=s=>String(s??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
  const flat=s=>String(s??'').replace(/\s+/g,' ').trim();
  function stress(){try{return !!(globalThis.v077Stress?.active||G?.stressMode||G?.cpuStress)}catch(_e){return false}}
  function mode(){try{const m=localStorage.getItem(SPEED_KEY);if(['slow','normal','fast','instant'].includes(m))return m}catch(_e){}return 'slow'}
  function preDelay(){if(stress())return 0;return ({slow:2200,normal:1300,fast:650,instant:0})[mode()]}
  function postDelay(){if(stress())return 0;return ({slow:1400,normal:850,fast:400,instant:20})[mode()]}
  function revealDelay(){if(stress())return 20;return ({slow:1900,normal:1450,fast:900,instant:420})[mode()]}
  globalThis.v0772CpuTurnLeadDelay=function(){if(stress())return 10;return ({slow:1250,normal:750,fast:350,instant:20})[mode()]};
  function trace(code,data){try{const key='palworld_v0772_battle_trace',a=JSON.parse(localStorage.getItem(key)||'[]');a.unshift({at:new Date().toISOString(),code,data:data||null});localStorage.setItem(key,JSON.stringify(a.slice(0,80)))}catch(_e){}try{console.info('[v0772]',code,data||'')}catch(_e){}}
  function statusCheck(){const s=globalThis.__v0772SourcePatchStatus||{},missing=Object.keys(s).filter(k=>!s[k]);if(missing.length){let e=document.getElementById('v0772CoreError');if(!e){e=document.createElement('div');e.id='v0772CoreError';document.body.appendChild(e)}e.textContent='ERR-CORE-0001 戦闘コア直挿し失敗: '+missing.join(', ');trace('ERR-CORE-0001',{missing,status:s})}else trace('CORE-PATCH-OK',s)}
  function cardEl(uid){if(uid==null)return null;const xs=[...document.querySelectorAll('.card[data-uid="'+uid+'"]')];return xs.find(x=>{const r=x.getBoundingClientRect();return r.width>8&&r.height>8})||xs[0]||null}
  function playerEl(def){try{const boxes=[...document.querySelectorAll('.v04PlayerBox,.v04Controls .v04PlayerBox,.v04SideMeta,.playerBox')];const name=flat(def?.name);return boxes.find(x=>name&&flat(x.textContent).includes(name))||boxes[0]||document.querySelector('.v04Controls')||document.querySelector('.v04Play')}catch(_e){return document.querySelector('.v04Play')}}
  function targetCard(attOwner,target){try{const d=other(attOwner);if(target?.type==='pal')return d?.pals?.find(x=>x.uid===target.uid)||null;if(target?.type==='structure')return d?.supports?.find(x=>x.uid===target.uid)||null}catch(_e){}return null}
  function attackNodes(attOwner,atk,target){const src=cardEl(atk?.uid);let dst=null,name='';if(target?.type==='player'){const d=other(attOwner);dst=playerEl(d);name=d?.name||'PLAYER'}else{const c=targetCard(attOwner,target);dst=cardEl(c?.uid||target?.uid);name=c?.name||'対象'}return {src,dst,name}}
  function clearAttack(){clearTimeout(attackTimer);const l=document.getElementById('v0772AttackLayer');if(l)l.innerHTML=''}
  function drawAttack(attOwner,atk,target){try{const {src,dst,name}=attackNodes(attOwner,atk,target);if(!src||!dst)return false;const sr=src.getBoundingClientRect(),dr=dst.getBoundingClientRect();if(sr.width<5||dr.width<5)return false;let l=document.getElementById('v0772AttackLayer');if(!l){l=document.createElement('div');l.id='v0772AttackLayer';document.body.appendChild(l)}const sx=sr.left+sr.width/2,sy=sr.top+sr.height/2,dx=dr.left+dr.width/2,dy=dr.top+dr.height/2;const pad=5;l.innerHTML='<div class="v0772AttackRing" style="left:'+(sr.left-pad)+'px;top:'+(sr.top-pad)+'px;width:'+(sr.width+pad*2)+'px;height:'+(sr.height+pad*2)+'px"></div><div class="v0772AttackRing target" style="left:'+(dr.left-pad)+'px;top:'+(dr.top-pad)+'px;width:'+(dr.width+pad*2)+'px;height:'+(dr.height+pad*2)+'px"></div><svg><defs><marker id="v0772ArrowHead" markerWidth="12" markerHeight="12" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#ffd95b"></path></marker></defs><line x1="'+sx+'" y1="'+sy+'" x2="'+dx+'" y2="'+dy+'" stroke="#ffd95b" stroke-width="7" stroke-linecap="round" marker-end="url(#v0772ArrowHead)" style="filter:drop-shadow(0 2px 3px #000)"></line></svg><div id="v0772AttackLabel">攻撃　'+esc(atk?.name||'攻撃側')+' → '+esc(name)+'</div>';clearTimeout(attackTimer);attackTimer=setTimeout(clearAttack,Math.max(1600,preDelay()+750));trace('ATK-VIS-001',{from:atk?.no||atk?.name,to:target?.type==='player'?'PLAYER':target?.uid});return true}catch(e){trace('ERR-ATK-VIS-001',{message:String(e)});return false}}
  globalThis.v0772MaybeDelayAttack=function(attOwner,atk,target,targetCard,after){drawAttack(attOwner,atk,target);let ai=false;try{ai=!!attOwner?.isAI||attOwner===G?.a}catch(_e){}if(!ai||stress())return false;const key=String(atk?.uid)+'|'+String(target?.type)+'|'+String(target?.uid??'player');if(resumeKey===key){resumeKey='';return false}const d=preDelay();if(d<=0)return false;resumeKey=key;nextCpuAt=Math.max(nextCpuAt,Date.now()+d+postDelay());trace('CPU-DELAY-001',{ms:d,key});setTimeout(()=>{try{declareBattle(attOwner,atk.uid,target,after)}catch(e){resumeKey='';trace('ERR-CPU-DELAY-001',{message:String(e)})}},d);return true};
  globalThis.v0772RefreshAttackCue=function(attOwner,atk,target){drawAttack(attOwner,atk,target)};
  globalThis.v0772GateCpuAttack=function(){
    if(stress())return false;
    const now=Date.now();
    let turnKey='';try{turnKey=String(G?.turnSeq??'')+'|'+String(G?.turn??'')}catch(_e){}
    if(turnKey&&G?.turn==='a'&&cpuGateTurn!==turnKey){
      cpuGateTurn=turnKey;
      let lead=0;try{lead=Number(globalThis.v0772CpuTurnLeadDelay?.()||0)}catch(_e){}
      nextCpuAt=Math.max(nextCpuAt,now+Math.max(0,lead));
      trace('CPU-TURN-LEAD-001',{ms:Math.max(0,lead),turn:G?.turnSeq});
    }
    const gate=Math.max(nextCpuAt,busyUntil);
    if(gate>now+25){
      const wait=gate-now+35;
      trace('CPU-ATTACK-GATE-001',{ms:wait,turn:G?.turnSeq});
      setTimeout(()=>{try{aiAttackNext()}catch(_e){}},wait);
      return true;
    }
    return false;
  };
  function existingImage(c){try{const name=flat(c?.name),no=flat(c?.no);const imgs=[...document.images];return imgs.find(i=>i.complete&&i.naturalWidth>20&&((name&&flat(i.alt)===name)||(no&&(i.dataset?.no===no||String(i.src).includes(no)))))||null}catch(_e){return null}}
  function art(c){const ex=existingImage(c);if(ex)return '<img class="v0772DamageImg" src="'+esc(ex.currentSrc||ex.src)+'" alt="'+esc(c?.name)+'">';try{if(typeof imageTag==='function')return imageTag(c,'v0772DamageImg')}catch(_e){}try{if(typeof cardHTML==='function')return cardHTML(c,{})}catch(_e){}return '<div style="padding:35px 10px;font-weight:900">'+esc(c?.name||c?.no||'公開カード')+'</div>'}
  function host(){let x=document.getElementById('v0772DamageOverlay');if(!x){x=document.createElement('div');x.id='v0772DamageOverlay';x.hidden=true;document.body.appendChild(x)}return x}
  function pump(){if(damageShowing||!damageQueue.length)return;damageShowing=true;const it=damageQueue.shift(),x=host();clearAttack();x.innerHTML='<div class="v0772DamageBox"><div class="v0772DamageHead">DAMAGE CHECK</div><div class="v0772DamageWho">'+esc(it.who)+'</div><div class="v0772DamageCount">'+it.index+' / '+it.total+'枚目</div><div class="v0772DamageStage">'+art(it.card)+'</div><div class="v0772DamageName">'+esc(it.card?.name||it.card?.no||'公開カード')+'</div>'+(it.card?.lucky?'<div class="v0772DamageLucky">★ LUCKY!</div>':'<div class="v0772DamageNormal">公開</div>')+'</div>';x.hidden=false;trace('DMG-REVEAL-001',{card:it.card?.no||it.card?.name,index:it.index,total:it.total,lucky:!!it.card?.lucky});const d=revealDelay();clearTimeout(damageTimer);damageTimer=setTimeout(()=>{x.hidden=true;damageShowing=false;pump()},d)}
  globalThis.v0772QueueDamageReveal=function(def,cards,amount,lucky){cards=Array.isArray(cards)?cards.filter(Boolean):[];if(!cards.length){trace('ERR-DMG-REVEAL-001',{reason:'no cards',amount});return}const who=(def?.name||'PLAYER')+' のダメージチェック';cards.forEach((c,i)=>damageQueue.push({card:c,index:i+1,total:cards.length,who}));const totalMs=revealDelay()*cards.length+postDelay();busyUntil=Math.max(busyUntil,Date.now()+totalMs);nextCpuAt=Math.max(nextCpuAt,busyUntil);pump()};
  function version(){try{const t=document.querySelector('.v04Title');if(t&&!G?.cpuVsCpu)t.textContent='v0.7.73';document.querySelectorAll('.badge.official').forEach(b=>{if(/^v?0\.7\.\d+/.test(flat(b.textContent)))b.textContent='v0.7.73'})}catch(_e){}}
  addEventListener('pageshow',()=>{resumeKey='';nextCpuAt=busyUntil=0;cpuGateTurn='';damageQueue=[];damageShowing=false;clearAttack();const d=document.getElementById('v0772DamageOverlay');if(d)d.hidden=true;setTimeout(()=>{version();statusCheck()},80)},{passive:true});
  setInterval(version,700);setTimeout(statusCheck,150);version();
  console.info('Palworld OCG v0.7.73 integrated battle-core helpers loaded; CPU lead delay is enforced at aiAttackNext entrance');
})();
</script>


`;


function v0772ApplyCoreSource(html){
  const status={AI_TURN_LEAD:true};
  const gateCode="if(typeof v0772GateCpuAttack==='function'&&v0772GateCpuAttack())return;";

  // v0.7.73: do not depend on the exact aiTurn scheduling literal.
  // The first aiAttackNext call of each CPU turn is held by v0772GateCpuAttack itself.
  // Only inject at the aiAttackNext function entrance, accepting several declaration styles.
  if(html.includes(gateCode)){
    status.AI_ATTACK_GATE=true;
  }else{
    const gatePatterns=[
      /(?:async\s+)?function\s+aiAttackNext\s*\([^)]*\)\s*\{/,
      /\b(?:const|let|var)\s+aiAttackNext\s*=\s*(?:async\s*)?function\s*\([^)]*\)\s*\{/,
      /\b(?:const|let|var)\s+aiAttackNext\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{/,
      /\baiAttackNext\s*=\s*(?:async\s*)?function\s*\([^)]*\)\s*\{/,
      /\baiAttackNext\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{/
    ];
    status.AI_ATTACK_GATE=false;
    for(const re of gatePatterns){
      if(re.test(html)){
        html=html.replace(re,m=>m+gateCode);
        status.AI_ATTACK_GATE=true;
        break;
      }
    }
  }

  const reps=[
    ["DECLARE_ATTACK_CUE","if(target.type==='player'){if(!canAttackPlayer(atk,def))return}else if(!targetCard||!canAttackCard(atk,targetCard,def))return;atk.rest=true;","if(target.type==='player'){if(!canAttackPlayer(atk,def))return}else if(!targetCard||!canAttackCard(atk,targetCard,def))return;if(typeof v0772MaybeDelayAttack==='function'&&v0772MaybeDelayAttack(attOwner,atk,target,targetCard,after))return;atk.rest=true;"],
    ["FINAL_TARGET_CUE","function quickWindowThenResolve(attOwner,atk,target,after=null){const def=other(attOwner),ints=interruptCards(def);","function quickWindowThenResolve(attOwner,atk,target,after=null){if(typeof v0772RefreshAttackCue==='function')v0772RefreshAttackCue(attOwner,atk,target);const def=other(attOwner),ints=interruptCards(def);"],
    ["PLAYER_DAMAGE_REVEAL","function playerDamage(def,amount){if(amount<=0){log(`${def.name}: 打撃0 — ダメージなし`);return}let milled=0,lucky=false;while(milled<amount&&def.deck.length){const c=def.deck.shift();milled++;putGrave(def,c,'Damage Check');if(c.lucky){lucky=true;break}}if(!lucky){def.life-=amount;log(`${def.name}: Damage Check ${milled}枚 / ライフ-${amount}`)}else log(`${def.name}: Lucky Pal! このダメージ解決ではライフ減少なし`);if(def.life<=0){loseGame(def,'ライフ0');return}if(def.deck.length===0){loseGame(def,'デッキ0枚');return}render()}","function playerDamage(def,amount){if(amount<=0){log(`${def.name}: 打撃0 — ダメージなし`);return}let milled=0,lucky=false,revealed=[];while(milled<amount&&def.deck.length){const c=def.deck.shift();milled++;revealed.push(c);putGrave(def,c,'Damage Check');if(c.lucky){lucky=true;break}}if(!lucky){def.life-=amount;log(`${def.name}: Damage Check ${milled}枚 / ライフ-${amount}`)}else log(`${def.name}: Lucky Pal! このダメージ解決ではライフ減少なし`);if(typeof v0772QueueDamageReveal==='function')v0772QueueDamageReveal(def,revealed,amount,lucky);if(def.life<=0){loseGame(def,'ライフ0');return}if(def.deck.length===0){loseGame(def,'デッキ0枚');return}render()}" ]
  ];
  for(const [id,from,to] of reps){
    if(html.includes(from)){html=html.replace(from,to);status[id]=true}else status[id]=false;
  }
  const boot='<script>window.__v0772SourcePatchStatus='+JSON.stringify(status).replace(/</g,'\\u003c')+';</script>';
  html=html.includes('</head>')?html.replace('</head>',boot+'\\n</head>'):boot+html;
  return {html,status};
}

function noCache(h){
  h.set("cache-control","no-store, no-cache, must-revalidate, max-age=0");
  h.set("pragma","no-cache");
  h.set("expires","0");
}

export default{
  async fetch(request){
    const u=new URL(request.url);
    const target=new URL(u.pathname+u.search,UPSTREAM);
    try{
      const r=await fetch(new Request(target.toString(),request));
      const h=new Headers(r.headers);
      h.set("x-palworld-bridge","v0.7.73-integrated-battle-core");

      if(["/","/index.html","/manifest.webmanifest","/sw.js"].includes(u.pathname))noCache(h);

      if(u.pathname==="/"||u.pathname==="/index.html"){
        let html=await r.text();
        const core=v0772ApplyCoreSource(html);html=core.html;
        if(!html.includes('id="v0738CenterRifleFix"')){
          html=html.includes("</body>")
            ?html.replace("</body>",PATCH+"\n</body>")
            :html+PATCH;
        }
        /* Keep the built-in BP01 report label in sync even if its module stores
           an older literal version string internally. */
        html=html.replaceAll('0.7.23',V).replaceAll('0.7.37',V);
        h.delete("content-length");
        h.delete("content-encoding");
        h.delete("etag");
        h.set("content-type","text/html; charset=utf-8");
        return new Response(html,{status:r.status,statusText:r.statusText,headers:h});
      }

      if(u.pathname==="/manifest.webmanifest"){
        let m={};try{m=JSON.parse(await r.text())}catch{}
        m.name=m.name||"Palworld OCG";
        m.short_name=m.short_name||"Palworld OCG";
        m.description="Palworld OCG v0.7.73 — 戦闘コア直挿し統合・AI入口ゲート・DAMAGE CHECK画像・攻撃矢印・CPU可読速度・Tier合法性ガード・全検査・診断・公式ルール同期";
        m.start_url="/?pwa=1&v=0773";
        m.scope="/";
        m.display=m.display||"standalone";
        m.orientation="landscape";
        h.delete("content-length");
        h.delete("content-encoding");
        h.delete("etag");
        h.set("content-type","application/manifest+json; charset=utf-8");
        return new Response(JSON.stringify(m),{status:200,headers:h});
      }

      if(u.pathname==="/sw.js"){
        let sw=await r.text();
        sw+="\n// v0.7.73 integrated battle core + robust AI attack entrance gate + damage image + attack arrow + diagnostics\n";
        h.delete("content-length");
        h.delete("content-encoding");
        h.delete("etag");
        h.set("service-worker-allowed","/");
        h.set("content-type","application/javascript; charset=utf-8");
        return new Response(sw,{status:r.status,statusText:r.statusText,headers:h});
      }

      return new Response(r.body,{status:r.status,statusText:r.statusText,headers:h});
    }catch{
      return new Response("Palworld OCG is temporarily unavailable.",{
        status:502,
        headers:{"content-type":"text/plain; charset=utf-8"}
      });
    }
  }
};