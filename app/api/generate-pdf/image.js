export async function getProfileImage() {
	const url = (process.env.BLOB_STORE_ACCESS || '') + (process.env.BLOB_PATH_NAME || '');
	if (!url) return '';
	const response = await fetch(url);
	if (!response.ok) return '';
	const contentType = response.headers.get('content-type') || '';
	let mime = 'image/png';
	if (contentType.startsWith('image/')) {
		mime = contentType.split(';')[0];
	} else if (url.match(/\.jpe?g$/i)) {
		mime = 'image/jpeg';
	} else if (url.match(/\.png$/i)) {
		mime = 'image/png';
	} else if (url.match(/\.svg$/i)) {
		mime = 'image/svg+xml';
	}
	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	return `data:${mime};base64,${buffer.toString('base64')}`;
}