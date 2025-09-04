# MTG Collection Viewer

A client-only React application for viewing and analyzing Magic: The Gathering card collections from CSV files. Features Scryfall image integration, advanced table functionality, and collection value estimation.

![MTG Collection Viewer Screenshot](https://github.com/user-attachments/assets/38d05a8f-3cca-462c-9507-a8f69e03ea1b)

## Features

- **CSV Upload**: Drag-and-drop or browse to upload your MTG collection CSV
- **Scryfall Integration**: Automatic card image fetching and caching from Scryfall API
- **Advanced Table**: Sortable columns, global search, pagination, and dense mode
- **Collection Analysis**: Automatic estimated value calculation (Price × Quantity)
- **Export Functionality**: Export filtered/searched data back to CSV
- **Persistent Storage**: Automatically saves your last uploaded CSV and image cache
- **Responsive Design**: Works on desktop and mobile devices

## CSV Format

Your CSV should include standard MTG collection columns. The app will automatically detect a `ScryfallId` column (case-insensitive) to enable image features. Example columns:

```csv
Name,Set,CollectorNumber,Foil,Quantity,Condition,Language,Price,ScryfallId
Lightning Bolt,LEA,161,No,4,Near Mint,English,15.99,f9a8a4a3-c5fd-481f-be7b-c6e6c4cccb3b
```

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Table**: @tanstack/react-table v8
- **CSV Parsing**: PapaParse
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Image API**: Scryfall
- **Deployment**: GitHub Pages

## How to Run Locally

1. **Prerequisites**: Ensure you have Node.js 20+ and pnpm installed
   ```bash
   npm install -g pnpm
   ```

2. **Clone and install**:
   ```bash
   git clone https://github.com/Poltergeist/manabox-csv-viewer.git
   cd manabox-csv-viewer
   pnpm install
   ```

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Build for production**:
   ```bash
   pnpm build
   ```

5. **Preview production build**:
   ```bash
   pnpm preview
   ```

## How to Deploy

This project is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Set source to "GitHub Actions"

2. **Push to main branch** - the deployment workflow will automatically:
   - Build the application with pnpm
   - Deploy to GitHub Pages
   - Make it available at `https://[username].github.io/manabox-csv-viewer/`

The deployment workflow uses pnpm and includes proper base path configuration for GitHub Pages.

## Usage

1. **Upload CSV**: Either drag-and-drop a CSV file or click "Browse Files"
2. **Try Sample**: Click "Load Sample Data" to see the app with example MTG cards
3. **Search & Filter**: Use the search box to find specific cards across all columns
4. **View Images**: If your CSV has ScryfallId column, click image thumbnails for full-size view
5. **Export**: Click "Export CSV" to download your current view as a CSV file
6. **Toggle Dense Mode**: Use the "Dense" button for compact table rows

## Image Caching

Card images are cached in browser localStorage for 7 days to reduce API calls and improve performance. The cache automatically expires and refreshes as needed.

## License

This project is open source. Card images are provided by [Scryfall](https://scryfall.com/) under their API terms.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Troubleshooting

- **Images not loading**: Check your internet connection and that Scryfall API is accessible
- **CSV not parsing**: Ensure your CSV has proper headers and is UTF-8 encoded
- **Performance issues**: Try dense mode for large collections or clear your browser cache
