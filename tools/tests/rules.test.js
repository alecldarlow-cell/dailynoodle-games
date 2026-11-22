'use strict';
// Game rule tests, moved from dailynoodle's tools/tests/unit/rules.test.js on 22 Nov 2026.
const {test}=require('node:test'),assert=require('node:assert/strict');
const path=require('node:path'),fs=require('node:fs'),vm=require('node:vm');
const ROOT=path.resolve(__dirname,'../..');
test('CITIES-02: production engine replays seed/moves exactly; illegal moves are atomic',()=>{
 const src=fs.readFileSync(path.join(ROOT,'reports/2026-10-16-strategy-ancient-cities.html'),'utf8');
 const a=src.indexOf('const AC=(function(){'),b=src.indexOf('\n})();',a)+6;assert.ok(a>=0&&b>a);
 const AC=vm.runInNewContext(src.slice(a,b)+'\nAC;',{}, {timeout:5000});
 const project=s=>JSON.stringify([s.scores,s.turn,s.offer,s.moves,s.tiles,s.over]);
 for(const seed of process.env.DN_NIGHTLY?[1,7,42,12345,20261019]:[42,20261019]){
  const s=AC.newMatch(0,seed);assert.equal(project(s),project(AC.newMatch(0,seed)));
  const before=project(s);assert.throws(()=>AC.play(s,99,999,999,0),/illegal move/);assert.equal(project(s),before);
  for(let k=0;k<12&&!s.over;k++){const m=AC.legal(s,s.offer[0])[0];assert.ok(m);AC.play(s,0,m.x,m.y,m.rots[0]);assert.ok(s.scores.every(Number.isFinite));assert.ok(s.scores.every(n=>n>=0));}
  assert.equal(project(s),project(AC.replay(0,seed,undefined,s.moves)));
 }
});
test('GLASS-01: every promised rare find fits over many seeded layouts',()=>{
 const src=fs.readFileSync(path.join(ROOT,'reports/2026-09-28-arcade-sea-glass.html'),'utf8');
 const dims=src.match(/const COLS=[^;]+;/)[0],balance=src.match(/const BAL=\{[^;]+;/)[0];
 const code=src.slice(src.indexOf('function placeFinds('),src.indexOf('/* ---------- end engine ---------- */'));
 const place=vm.runInNewContext(dims+balance+code+'\nplaceFinds;');
 for(let seed=1;seed<=(process.env.DN_NIGHTLY?2000:100);seed++){
  let state=seed;const rng=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
  const found=place(rng,['a','b','c']);assert.equal(found.length,3,'seed '+seed);
  for(let i=0;i<found.length;i++){const a=found[i];assert.ok(a.r>=6&&a.r<8&&a.c>=0&&a.c<7);for(let j=0;j<i;j++)assert.ok(Math.abs(a.r-found[j].r)+Math.abs(a.c-found[j].c)>=3);}
 }
});
