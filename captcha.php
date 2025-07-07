
<?php
session_start();
header('Content-type: image/png');

// Create image
$image = imagecreatetruecolor(200, 50);
$bg_color = imagecolorallocate($image, 255, 255, 255);
imagefilledrectangle($image, 0, 0, 200, 50, $bg_color);

// Generate random string
$chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
$captcha = substr(str_shuffle($chars), 0, 6);
$_SESSION['captcha'] = $captcha;

// Add text to image
$text_color = imagecolorallocate($image, 0, 0, 0);
$font = 'arial.ttf'; // Make sure you have this font or change to one you have
imagettftext($image, 20, 0, 30, 35, $text_color, $font, $captcha);

// Add noise
for ($i = 0; $i < 5; $i++) {
    $color = imagecolorallocate($image, rand(0, 255), rand(0, 255), rand(0, 255));
    imageline($image, rand(0, 200), rand(0, 50), rand(0, 200), rand(0, 50), $color);
}

// Output image
imagepng($image);
imagedestroy($image);
?>
