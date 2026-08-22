const UPSTREAM="https://palworld-game-bcy.pages.dev";
const V="0.7.43";

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
      if(title&&title.textContent!=='v0.7.43 戦闘UI改善＋中央盤面拡大')
        title.textContent='v0.7.43 戦闘UI改善＋中央盤面拡大';

      /* 起動画面のバージョン表示もWorker実装と同期 */
      document.querySelectorAll('.badge.official').forEach(b=>{
        if(/^v?0\.7\.\d+/.test((b.textContent||'').trim())) b.textContent='v0.7.43';
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
      console.error('BP01-084 v0.7.43 official probe',e);
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
        r.reasons=['v0.7.43公式処理ルートを実行（墓地AUTO解決後にNormal Pal回収を確認）'];
      }else{
        r.status='mismatch';
        r.reasons=['v0.7.43デスティング墓地AUTO確認に失敗'];
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
        v072BpReport.version='0.7.43 Battle UX + Official Sync';
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
        if(title && !G?.cpuVsCpu)title.textContent='v0.7.43 戦闘UI改善＋公式ルール同期';
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

  console.info('Palworld OCG v0.7.43 battle UX + official rule sync applied: BP01-084 / Q74 / Q93 / mulligan order');
})();
</script>

<style id="v0743CombatUX">
/* v0.7.43 — battle UX inspired by a compact digital-card-game flow.
   Gameplay/rules are untouched: this layer only changes guidance, modals and FX. */
.app.v04.v0743CombatUX .v04Play{position:relative!important}

/* Selected attacker + legal targets are obvious at a glance. */
.app.v04.v0743CombatUX .v04Play .card.attackSelected{
  outline:2px solid #ff665a!important;
  box-shadow:0 0 0 2px #240000aa inset,0 0 16px #ff4d3dcc!important;
  transform:translateY(-2px) scale(1.025);
  z-index:8;
}
.app.v04.v0743CombatUX .v04Play .zone.validTarget,
.app.v04.v0743CombatUX .v04Play .stack.target{
  border-color:#ffd95b!important;
  box-shadow:0 0 0 1px #fff1a8 inset,0 0 14px #ffd95b99!important;
  animation:v0743TargetPulse .72s ease-in-out infinite alternate;
}
.app.v04.v0743CombatUX .v04Play .zone.validTarget .card{
  filter:brightness(1.12) saturate(1.12);
}
@keyframes v0743TargetPulse{
  from{filter:brightness(.94)}
  to{filter:brightness(1.18)}
}

/* Small instruction chip, instead of making the player scan the side controls. */
.v0743CombatHint{
  position:absolute;left:50%;top:4px;transform:translateX(-50%);
  z-index:32;display:none;align-items:center;gap:6px;
  max-width:72%;padding:4px 10px;border-radius:999px;
  border:1px solid #e3c45e;background:#071410ee;color:#f9f1d0;
  box-shadow:0 4px 16px #000b;font-size:8px;font-weight:950;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none;
}
.v0743CombatHint.show{display:flex}
.v0743CombatHint:before{content:"⚔";color:#ffd85e;font-size:10px}

/* Battle reaction sheet: compact, bottom-oriented and focused on the current choice. */
.modal.v0743CombatModal{
  align-items:flex-end!important;justify-content:center!important;
  padding:6px!important;background:#0008!important;backdrop-filter:blur(2px);
}
.modal.v0743CombatModal>.modalCard{
  width:min(760px,96vw)!important;max-width:760px!important;
  max-height:55vh!important;overflow:auto!important;
  padding:8px!important;border-radius:16px 16px 8px 8px!important;
  border:1px solid #d2b64f!important;
  background:linear-gradient(180deg,#0c1d2a,#08130f 72%)!important;
  box-shadow:0 -10px 32px #000c!important;
}
.v0743CombatHead{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px}
.v0743CombatHead h2{margin:0!important;font-size:13px!important;color:#ffe072!important}
.v0743CombatSub{font-size:8px;color:#c6d8cf;line-height:1.35;margin-top:2px}
.v0743CombatCards{display:flex;gap:7px;overflow-x:auto;padding:2px 1px 5px;align-items:stretch}
.v0743CombatChoice{
  flex:0 0 92px;border:1px solid #557568;border-radius:10px;background:#071711;
  padding:4px;cursor:pointer;box-shadow:0 3px 10px #0008;
}
.v0743CombatChoice .card{height:92px!important;width:82px!important;min-width:82px!important;margin:0 auto 4px!important}
.v0743CombatChoice .v0743ChoiceLabel{
  display:block;text-align:center;border-radius:7px;padding:4px 2px;
  background:#154f3d;border:1px solid #78c9a9;color:#fff;font-size:8px;font-weight:950;
}
.v0743CombatActions{display:flex;gap:6px;margin-top:6px}
.v0743CombatActions button{flex:1!important;padding:7px 5px!important;font-size:9px!important;font-weight:950!important;border-radius:9px!important}
.v0743Skip{background:#372a2a!important;border-color:#8d6868!important}
.v0743QuickRow{display:grid;grid-template-columns:86px minmax(0,1fr);gap:7px;align-items:center;border-top:1px solid #29463a;padding:6px 0}
.v0743QuickRow:first-of-type{border-top:0}
.v0743QuickRow .card{height:88px!important;width:78px!important;min-width:78px!important}
.v0743QuickBtns{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.v0743QuickBtns button{padding:7px 4px!important;font-size:8px!important;font-weight:900!important;border-radius:8px!important}

/* Attack arrow / impact / result toast. Appended to <html>, so body rotation does not distort coordinates. */
#v0743BattleFxLayer{position:fixed;inset:0;z-index:2147483000;pointer-events:none;overflow:hidden}
#v0743BattleFxLayer svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
#v0743BattleFxLayer .v0743AttackLine{
  stroke:#ffd75a;stroke-width:5;stroke-linecap:round;
  filter:drop-shadow(0 0 5px #ff6b3d) drop-shadow(0 0 9px #000);
  stroke-dasharray:14 8;animation:v0743Dash .38s linear infinite;
}
@keyframes v0743Dash{to{stroke-dashoffset:-44}}
.v0743Impact{
  position:fixed;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;
  border:3px solid #fff2a5;box-shadow:0 0 0 4px #ff634788,0 0 22px #ff553e;
  animation:v0743Impact .42s ease-out forwards;
}
@keyframes v0743Impact{from{transform:scale(.35);opacity:1}to{transform:scale(2.7);opacity:0}}
.v0743ResultToast{
  position:fixed;left:50%;top:18%;transform:translate(-50%,-50%) scale(.92);
  min-width:130px;max-width:70vw;padding:7px 12px;border-radius:12px;
  border:1px solid #e8ca5b;background:#07140ff2;color:#fff;text-align:center;
  font-size:10px;font-weight:950;box-shadow:0 7px 22px #000c;
  animation:v0743Toast .72s ease-out forwards;
}
.v0743ResultToast b{color:#ffd85d}
@keyframes v0743Toast{0%{opacity:0;transform:translate(-50%,-44%) scale(.9)}15%,72%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-56%) scale(.98)}}

@media(max-height:520px) and (orientation:landscape){
  .v0743CombatHint{font-size:7px;padding:3px 8px;top:2px}
  .modal.v0743CombatModal>.modalCard{max-height:64vh!important}
  .v0743CombatChoice{flex-basis:82px}.v0743CombatChoice .card{height:80px!important;width:72px!important;min-width:72px!important}
  .v0743ResultToast{top:15%;font-size:8px;padding:5px 9px}
}
</style>

<script id="v0743CombatUXScript">
(()=>{
  if(globalThis.__v0743CombatUXApplied)return;
  globalThis.__v0743CombatUXApplied=true;

  let scheduled=false;
  let lastArrowAt=0;

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
    let x=document.getElementById('v0743BattleFxLayer');
    if(x)return x;
    x=document.createElement('div');
    x.id='v0743BattleFxLayer';
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
    marker.setAttribute('id','v0743ArrowHead');marker.setAttribute('markerWidth','10');marker.setAttribute('markerHeight','10');
    marker.setAttribute('refX','8');marker.setAttribute('refY','3');marker.setAttribute('orient','auto');marker.setAttribute('markerUnits','strokeWidth');
    const path=document.createElementNS(ns,'path');path.setAttribute('d','M0,0 L0,6 L9,3 z');path.setAttribute('fill','#ffd75a');
    marker.appendChild(path);defs.appendChild(marker);svg.appendChild(defs);
    const line=document.createElementNS(ns,'line');
    line.setAttribute('x1',a.x);line.setAttribute('y1',a.y);line.setAttribute('x2',b.x);line.setAttribute('y2',b.y);
    line.setAttribute('marker-end','url(#v0743ArrowHead)');line.setAttribute('class','v0743AttackLine');svg.appendChild(line);layer.appendChild(svg);
    const impact=document.createElement('div');impact.className='v0743Impact';impact.style.left=b.x+'px';impact.style.top=b.y+'px';layer.appendChild(impact);
    lastArrowAt=Date.now();
    setTimeout(()=>{if(layer&&Date.now()-lastArrowAt>=380)layer.innerHTML=''},430);
  }
  function arrowBetween(attOwner,atk,target){
    try{drawArrowPoints(centerOf(uidEl(atk?.uid)),centerOf(targetEl(attOwner,target)))}catch(_e){}
  }
  function toast(html){
    try{
      const layer=fxLayer();
      const t=document.createElement('div');t.className='v0743ResultToast';t.innerHTML=html;layer.appendChild(t);
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
        '<div class="v0743CombatChoice" onclick="chooseBlock('+c.uid+')">'+
          cardHTML(c,{select:true})+
          '<span class="v0743ChoiceLabel">ブロック</span></div>'
      ).join('');
      return '<div class="modal v0743CombatModal"><div class="modalCard">'+
        '<div class="v0743CombatHead"><div><h2>ブロックしますか？</h2><div class="v0743CombatSub">'+safeText(head)+'<br>ブロックするパルを選択してください。</div></div></div>'+
        '<div class="v0743CombatCards">'+rows+'</div>'+
        '<div class="v0743CombatActions"><button class="v0743Skip" onclick="chooseBlock(null)">ブロックしない</button></div>'+
        '</div></div>';
    };
  }

  if(typeof quickModalHTML==='function'){
    quickModalHTML=function(){
      if(!pendingQuick)return'';
      const rows=(pendingQuick.ints||[]).map(c=>
        '<div class="v0743QuickRow">'+cardHTML(c,{select:true})+
        '<div><b style="font-size:9px">'+safeText(c.name)+'</b><div class="v0743CombatSub">この攻撃を無効にする</div>'+
        '<div class="v0743QuickBtns" style="margin-top:5px">'+
        '<button '+(standingSouls(G.p)<1?'disabled':'')+' onclick="event.stopPropagation();chooseInterrupt('+c.uid+',\'soul\')">1ソウル＋このカード</button>'+
        '<button '+(G.p.hand.length<2?'disabled':'')+' onclick="event.stopPropagation();chooseInterrupt('+c.uid+',\'discard\')">このカード＋手札1枚</button>'+
        '</div></div></div>'
      ).join('');
      return '<div class="modal v0743CombatModal"><div class="modalCard">'+
        '<div class="v0743CombatHead"><div><h2>割り込みを使いますか？</h2><div class="v0743CombatSub">相手ターンのバトル中。使うカードとコストを選択してください。</div></div></div>'+
        rows+'<div class="v0743CombatActions"><button class="v0743Skip" onclick="skipInterrupt()">使わない</button></div>'+
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
        isCpu=!!attOwner?.isAI;
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
      if(app)app.classList.add('v0743CombatUX');
      const play=playRoot();
      if(!play)return;
      let hint=play.querySelector('.v0743CombatHint');
      if(!hint){hint=document.createElement('div');hint.className='v0743CombatHint';play.appendChild(hint)}
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

  try{new MutationObserver(scheduleCombatUX).observe(document.documentElement,{childList:true,subtree:true})}catch(_e){}
  addEventListener('pageshow',applyCombatUX,{passive:true});
  addEventListener('resize',scheduleCombatUX,{passive:true});
  applyCombatUX();setTimeout(applyCombatUX,300);setTimeout(applyCombatUX,1100);
  console.info('Palworld OCG v0.7.43 combat UX applied');
})();
</script>

`;

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
      h.set("x-palworld-bridge","v0.7.43-battle-ux-official-rule-sync");

      if(["/","/index.html","/manifest.webmanifest","/sw.js"].includes(u.pathname))noCache(h);

      if(u.pathname==="/"||u.pathname==="/index.html"){
        let html=await r.text();
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
        m.description="Palworld OCG v0.7.43 — 戦闘UI改善・公式ルール同期・中央盤面拡大";
        m.start_url="/?pwa=1&v=0743";
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
        sw+="\n// v0.7.43 battle UX + official rule sync + center + rotated hand swipe fix\n";
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