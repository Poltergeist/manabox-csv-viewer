export const SAMPLE_CSV_DATA = `Name,Set code,Set name,Collector number,Foil,Rarity,Quantity,ManaBox ID,Scryfall ID,Purchase price,Misprint,Altered,Condition,Language,Purchase price currency
"Haliya, Guided by Light",EOE,Edge of Eternities,19,normal,rare,3,107055,6f7c63ae-5df3-410f-8643-b8c69133ca9d,1.35,false,false,near_mint,en,EUR
Loading Zone,EOE,Edge of Eternities,196,normal,rare,1,107371,0d2c95bd-79af-4a23-b265-62cc0b164e3e,0.47,false,false,near_mint,en,EUR
Weapons Manufacturing,EOE,Edge of Eternities,168,normal,rare,1,107111,a058f1a6-318c-4bba-981e-ace079ada806,2.24,false,false,near_mint,en,EUR
"Dyadrine, Synthesis Amalgam",EOE,Edge of Eternities,216,foil,rare,1,107498,994ca692-7138-4dcb-bf46-5da530f86036,0.17,false,false,near_mint,en,EUR
Mutinous Massacre,EOE,Edge of Eternities,222,normal,rare,1,107012,42d5034f-18f0-4d57-9840-6be52c286247,0.02,false,false,near_mint,en,EUR
Sacred Foundry,EOE,Edge of Eternities,256,normal,rare,1,106767,8b4e2642-3c87-4708-b9b4-2e7f7359ac7d,8.39,false,false,near_mint,en,EUR
Lumen-Class Frigate,EOE,Edge of Eternities,25,normal,rare,1,107370,0cc59b5a-65fa-47cc-8ac7-b7c3f533a782,0.13,false,false,near_mint,en,EUR
Frenzied Baloth,EOE,Edge of Eternities,183,normal,rare,2,107158,c72d85e9-a0bc-4f73-8d73-c58843577f4e,2.38,false,false,near_mint,en,EUR
Sunken Citadel,EOS,Edge of Eternities: Stellar Sights,41,normal,rare,1,107506,a12a9d09-7b6a-4207-96db-0d968cbdc09c,0.49,false,false,near_mint,en,EUR
"Tezzeret, Cruel Captain",EOE,Edge of Eternities,2,normal,mythic,1,106752,02e8e540-8aa3-4e6a-9a11-c3949cab5f0f,25.6,false,false,near_mint,en,EUR
Moonlit Meditation,EOE,Edge of Eternities,69,normal,rare,1,107580,f2a56007-5bca-4edf-9cc4-5f77a273636c,0.02,false,false,near_mint,en,EUR
Creeping Tar Pit,EOS,Edge of Eternities: Stellar Sights,9,normal,rare,1,107508,a2184faf-6fa0-4d3c-b811-814beffe4320,0.33,false,false,near_mint,en,EUR
Pinnacle Starcage,EOE,Edge of Eternities,27,normal,rare,1,107519,b1f40c4c-a955-4d9c-8225-251fa4159124,0.45,false,false,near_mint,en,EUR
Starwinder,EOE,Edge of Eternities,291,normal,rare,1,107448,637a4457-5600-4d33-81c7-f4009df3d8a5,3.19,false,false,near_mint,en,EUR
Raging Ravine,EOS,Edge of Eternities: Stellar Sights,35,normal,rare,1,107574,ed878350-ebc3-419b-9dd9-384e44906569,0.27,false,false,near_mint,en,EUR
"Sothera, the Supervoid",EOE,Edge of Eternities,115,normal,mythic,1,106772,e99d6fc0-dcf2-4b25-81c2-02c230a36246,4.54,false,false,near_mint,en,EUR
Uthros Psionicist,EOE,Edge of Eternities,84,foil,uncommon,1,107566,e23cc5fd-afe4-480c-8858-ed80a082584e,0.13,false,false,near_mint,en,EUR
Codecracker Hound,EOE,Edge of Eternities,50,normal,uncommon,3,107598,6723b891-6013-4ec6-b439-2233d270dc48,0.06,false,false,near_mint,en,EUR
Cloudsculpt Technician,EOE,Edge of Eternities,49,normal,common,2,107718,51077a54-15cf-4088-8e84-088d72e8e861,0.04,false,false,near_mint,en,EUR`;

export const parseCSVData = (csvText: string) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
  
  return { headers, rows };
};