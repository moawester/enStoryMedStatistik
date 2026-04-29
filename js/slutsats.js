// HERO / HEADER
addToPage(`
<div style="
  max-width: 900px;
  margin: 0 auto 30px auto;
  padding: 32px;
  border-radius: 16px;
  background: linear-gradient(135deg,#0f172a,#1e293b);
  color: #fff;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
">
  <h1 style="margin:0 0 10px 0;">Slutsats</h1>
  <p style="font-size:18px; line-height:1.6; margin:0;">
    Vad säger datan om Sverige – röstar vi olika beroende på var vi bor?
  </p>
</div>
`);

// VISUELL SAMMANFATTNING
addToPage(`
<div style="max-width: 900px; margin: 0 auto 30px auto; display:grid; grid-template-columns: repeat(3, 1fr); gap:16px;">

  <div style="background:#f8fafc; padding:22px; border-radius:14px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <div style="font-size:32px; font-weight:bold; color:#0f172a;">3</div>
    <p style="margin:8px 0 0 0;">perspektiv på geografi</p>
  </div>

  <div style="background:#ecfeff; padding:22px; border-radius:14px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <div style="font-size:32px; font-weight:bold; color:#0e7490;">2018 → 2022</div>
    <p style="margin:8px 0 0 0;">förändring över tid</p>
  </div>

  <div style="background:#fef3c7; padding:22px; border-radius:14px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <div style="font-size:32px; font-weight:bold; color:#92400e;">Röstning skiljer sig </div>
    <p style="margin:8px 0 0 0;">beroende på plats</p>
  </div>

</div>
`);

// CARDS
addToPage(`
<div style="max-width: 900px; margin: 0 auto; display:grid; gap:18px;">

  <div style="background:#ffffff; padding:24px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <h2 style="margin-top:0;">Vad visar analyserna?</h2>
    <p>
      Våra analyser visar tydligt att röstningen i Sverige inte är jämnt fördelad, utan varierar beroende på geografi.
      Både valresultat och förändringar mellan 2018 och 2022 skiljer sig mellan olika delar av landet.
    </p>
    <ul>
      <li><b>Regionala skillnader:</b> Partiers stöd varierar mellan olika län.</li>
      <li><b>Stad vs landsbygd:</b> Befolkningstäthet har ett samband med hur partistöd förändras.</li>
      <li><b>Geografiska trender:</b> Förändringar sker olika i olika delar av landet.</li>
    </ul>
  </div>

  <div style="background:#f8fafc; padding:24px; border-radius:14px;">
    <h2 style="margin-top:0;">Svar på vår frågeställning</h2>
    <p style="font-size:18px;"><b>Röstar vi olika beroende på var vi bor?</b></p>
    <p>
      Utifrån våra analyser kan vi se att geografi verkar ha betydelse för hur människor röstar.
      Det finns tydliga skillnader mellan stad och landsbygd, mellan olika län och mellan kommuner.
    </p>
    <p>
      Samtidigt är det viktigt att förstå att geografi inte är den enda faktorn.
      Bakom dessa skillnader finns även andra variabler, såsom ekonomi, utbildningsnivå, ålder och befolkningssammansättning.
    </p>
  </div>

  <div style="background:#ecfeff; border-left:6px solid #06b6d4; padding:24px; border-radius:14px;">
    <h2 style="margin-top:0;">Slutsats</h2>
    <p>
      Sammanfattningsvis visar projektet att röstningen i Sverige har tydliga geografiska mönster,
      och att dessa förändrades mellan riksdagsvalen 2018 och 2022.
    </p>
    <p>
      Resultaten tyder på att Sverige delvis kan vara politiskt uppdelat beroende på var människor bor,
      där skillnader syns både mellan stad och landsbygd och mellan olika delar av landet.
    </p>
    <p>
      Analysen visar tydliga samband, men kan inte fastställa exakta orsaker till varför skillnaderna uppstår.
      Detta innebär att resultaten bör tolkas med viss försiktighet.
    </p>
    <p>
      Detta visar att geografi är en central faktor att ta hänsyn till vid analys av politiska mönster i Sverige.
    </p>
  </div>

  <div style="background:#ffffff; padding:24px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <h2 style="margin-top:0;">Reflektion</h2>
    <p>
      En styrka med projektet är att vi har kombinerat flera datakällor och analyserat valresultatet ur olika perspektiv,
      vilket ger en mer nyanserad bild av verkligheten.
    </p>
    <p>
      En begränsning är att analysen främst fokuserar på geografiska faktorer.
      För en djupare förståelse hade det varit relevant att inkludera fler variabler, exempelvis inkomst,
      utbildningsnivå, ålder eller arbetslöshet.
    </p>
    <p>
      Det hade även varit intressant att analysera fler valår för att undersöka om de mönster vi ser
      är långsiktiga trender eller specifika för perioden 2018–2022.
    </p>
  </div>

  <div style="background:#f1f5f9; padding:24px; border-radius:14px;">
  <h2 style="margin-top:0;">Källor och begränsningar</h2>

  <h3>Länsinfo (SQLite)</h3>
  <p>
    Information om Sveriges län används som grund för regional indelning.
  </p>
  <p><strong>Trovärdighet:</strong> Källan består av allmänt etablerad fakta om länsindelning. Eftersom datan kommer från Wikipedia och inte kommer direkt från en myndighet bör den betraktas som relativt tillförlitlig men inte lika stark som officiella källor.</p>
  <p><strong>Datakvalitet:</strong> Datan ger en tydlig översikt över länens struktur. Mindre variationer eller uppdateringar kan förekomma beroende på ursprung.</p>

  <h3>Statistik om medelåldrar och medel-/medianinkomst (MongoDB)</h3>
  <p>
    Datan bygger på demografisk och ekonomisk statistik för Sveriges kommuner.
  </p>
  <p><strong>Trovärdighet:</strong> Uppgifterna baseras på statistik från SCB, en statlig och mycket tillförlitlig myndighet.</p>
  <p><strong>Datakvalitet:</strong> Materialet är välstrukturerat och detaljerat och lämpar sig för analyser av befolkning och inkomstnivåer. </p>

  <h3>Statistik kring riksdagsval 2018 och 2022 (Neo4j)</h3>
  <p>
    Valdatan bygger på officiella resultat från riksdagsvalen 2018 och 2022.
  </p>
  <p><strong>Trovärdighet:</strong> Valresultat från svenska myndigheter är mycket tillförlitliga.</p>
  <p><strong>Datakvalitet:</strong> Resultaten är exakta och detaljerade på kommunnivå, men visar endast vad människor röstat på – inte varför.</p>

  <h3>Geodata kring tätorter, kommuner och län (DBeaver)</h3>
  <p>
    Geodatan omfattar kommungränser, tätorter och län. Ursprunget är inte helt fastställt, men sannolikt baserat på material från nationell kartdata.
  </p>
  <p><strong>Trovärdighet:</strong> Om datan kommer från officiell kartmyndighet är trovärdigheten hög. Vid okänt ursprung bör dock viss försiktighet tillämpas.</p>
  <p><strong>Datakvalitet:</strong> Datan är lämplig för geografiska analyser, men kvaliteten kan variera beroende på den exakta källan.</p>

  <h3>Befolkningstäthet (SQLite)</h3>
  <p>
    Kommunurvalet bygger på befolkningstäthet och används för att dela in kommuner i stads- och landsbygdskategorier.
  </p>
  <p><strong>Trovärdighet:</strong> SCB är en statlig myndighet och en mycket tillförlitlig källa, vilket gör datan trovärdig.</p>
  <p><strong>Datakvalitet:</strong> Datan ger en tydlig bild av hur tätbefolkade olika kommuner är och är relevant för geografisk analys. Samtidigt fångar den inte alla faktorer som kan påverka röstning.</p>

  <h3>Begränsningar</h3>
  <ul>
    <li>Analysen fokuserar främst på geografi och demografi.</li>
    <li>Faktorer som utbildning, ålder eller inkomst ingår inte konsekvent i alla dataset.</li>
    <li>Datan kan visa mönster och samband, men inte fastställa direkta orsaker.</li>
  </ul>
</section>
    </div>
`);