<?php
// albums.php
// Make sure this file is placed in the same folder (or an accessible location) as your index.html.
// Adjust the path to assets/images/events/ as needed.

header('Content-Type: application/json; charset=utf-8');

// 1. Base directory for your event albums
$baseDir = __DIR__ . '/assets/images/events';

// 2. Array to hold all album info
$albums = [];

// 3. Get all subfolders in /events
$dirs = glob($baseDir . '/*', GLOB_ONLYDIR);

foreach ($dirs as $dirPath) {
    // e.g. "/home/username/public_html/assets/images/events/AFTER-PARTY-PHOTOS"
    $folderName = basename($dirPath); // "AFTER-PARTY-PHOTOS"

    // 4. Grab all image files inside this subfolder
    $images = glob($dirPath . '/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF}', GLOB_BRACE);

    // Build album data
    $albums[] = [
        'title'  => $folderName, // e.g. "AFTER-PARTY-PHOTOS"
        'images' => []
    ];

    // 5. Convert absolute paths -> relative or public URLs
    foreach ($images as $imgPath) {
        // For the relative path, remove __DIR__ from $imgPath:
        // e.g. "/home/username/public_html/assets/images/events/AFTER-PARTY-PHOTOS/img1.jpg"
        // becomes "assets/images/events/AFTER-PARTY-PHOTOS/img1.jpg"
        $relativePath = str_replace(__DIR__ . '/', '', $imgPath);

        // Optionally replace any backslashes if on Windows host, just in case
        $relativePath = str_replace('\\', '/', $relativePath);

        // Append to images
        $albums[count($albums) - 1]['images'][] = $relativePath;
    }
}

// Return JSON
echo json_encode($albums, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;
