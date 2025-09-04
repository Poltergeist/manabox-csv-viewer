export const SAMPLE_CSV_DATA = `Name,Set,Set Code,Collector Number,Rarity,Foil,Quantity,Condition,Language,Price,Scryfall ID
Lightning Bolt,Limited Edition Alpha,LEA,161,Common,No,4,Near Mint,English,15.99,f9a8a4a3-c5fd-481f-be7b-c6e6c4cccb3b
Black Lotus,Limited Edition Alpha,LEA,232,Rare,No,1,Poor,English,8000.00,bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd
Ancestral Recall,Limited Edition Alpha,LEA,47,Rare,No,1,Lightly Played,English,1200.00,2398892d-28e9-4009-b36e-2b330218989d
Time Walk,Limited Edition Alpha,LEA,370,Rare,No,2,Moderately Played,English,800.00,70901356-3266-4bd9-aacc-f06c27271de5
Mox Pearl,Limited Edition Alpha,LEA,264,Rare,No,1,Near Mint,English,2500.00,ed0216a0-6082-491a-8100-6a4a75bd5df2
Sol Ring,Commander 2021,C21,263,Uncommon,No,8,Near Mint,English,2.50,4cad6e84-f451-4dd7-b601-6e9aaa6c0e5d
Counterspell,Ice Age,ICE,64,Common,No,4,Near Mint,English,1.25,1379f364-1fb2-413c-b002-8e1ca13b4700
Lightning Bolt,Magic 2010,M10,146,Common,Yes,2,Near Mint,English,25.00,f9a8a4a3-c5fd-481f-be7b-c6e6c4cccb3b
Giant Growth,Limited Edition Alpha,LEA,184,Common,No,4,Lightly Played,English,8.50,9a487199-3eec-4813-be19-788c9a2a5739
Dark Ritual,Limited Edition Alpha,LEA,98,Common,No,4,Near Mint,English,12.00,95f27eeb-6f14-4db3-adb9-9be5ed76b34b`;

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