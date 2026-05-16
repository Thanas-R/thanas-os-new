// Music player — fully hardcoded iTunes URLs, instant load, zero search on startup.

import { useEffect, useState } from 'react';
import cradlesCover from '@/assets/image-asset.jpg';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Category =
  | 'English Mix'
  | 'Anime'
  | 'Hindi'
  | 'Sports / Anthems'
  | 'Movie Themes'
  | 'Electronic'
  | 'Hip-Hop'
  | 'Indie / Rock';

export interface Track {
  title: string;
  artist: string;
  cover: string;
  previewUrl?: string;
  album?: string;
  category?: Category;
  searchTerm?: string;
  resolved?: boolean;
}

export interface NowPlaying extends Track {
  playing: boolean;
  progress: number;
  duration: number;
  currentTime: number;
}

// ─── Hardcoded iTunes Data (merged + deduplicated) ────────────────────────────

const TRACK_DATA: Record<string, { previewUrl: string; cover: string; album: string }> = {
  // ── English Mix ──
  "Cradles|||Sub Urban": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e7/73/9a/e7739aa7-78e0-b151-7020-855263b2b637/mzaf_72505415590787732.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7b/bd/88/7bbd8845-ace6-cbba-1925-834b3e1b47ac/8721465222470.png/600x600bb.jpg", album: "Cradles - Single" },
  "Blinding Lights|||The Weeknd": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/17/b4/8f/17b48f9a-0b93-6bb8-fe1d-3a16623c2cfb/mzaf_9560252727299052414.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a6/6e/bf/a66ebf79-5008-8948-b352-a790fc87446b/19UM1IM04638.rgb.jpg/600x600bb.jpg", album: "Blinding Lights - Single" },
  "Levitating|||Dua Lipa": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/59/dc/4d/59dc4dda-93ff-8f1c-c536-f005f6ea6af5/mzaf_3066686759813252385.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6c/11/d6/6c11d681-aa3a-d59e-4c2e-f77e181026ab/190295092665.jpg/600x600bb.jpg", album: "Future Nostalgia" },
  "bad guy|||Billie Eilish": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c3/87/1f/c3871f7e-3260-d615-1c66-5fdca2c3a48f/mzaf_10721331211699880949.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1a/37/d1/1a37d1b1-8508-54f2-f541-bf4e437dda76/19UMGIM05028.rgb.jpg/600x600bb.jpg", album: "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?" },
  "Viva La Vida|||Coldplay": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/2b/04/65/2b0465c3-2db1-e461-2362-14b528456b8f/mzaf_1805426141027060154.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/52/aa/85/52aa851f-15b7-6322-f91f-df84b15b7b19/190295978044.jpg/600x600bb.jpg", album: "Viva La Vida or Death and All His Friends" },
  "Counting Stars|||OneRepublic": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b0/db/7f/b0db7fbe-f8ff-1f67-fe72-ca8185ffbca2/mzaf_15298650366584767800.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/25/46/a7/2546a71a-b2bb-b4c9-4c52-a4daa3ae23ca/13UMGIM15076.rgb.jpg/600x600bb.jpg", album: "Native (Deluxe)" },
  "Shape of You|||Ed Sheeran": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/c7/4f/44c74f0d-72dc-6143-d4d0-ba14d661ca0d/mzaf_9566898362556366703.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/600x600bb.jpg", album: "÷ (Deluxe)" },
  "Uptown Funk|||Mark Ronson": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/62/e1/98/62e19826-cd13-6eff-390e-dbca502bb7b5/mzaf_8006535252627949661.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7e/30/c5/7e30c572-aa47-5f7b-c6fd-42d50cd2c56d/886444959797.jpg/600x600bb.jpg", album: "Uptown Special" },
  "Watermelon Sugar|||Harry Styles": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/16/86/f5/1686f50d-8b77-7e32-85f7-5f0e804d68fe/mzaf_14195633304344507287.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2b/c4/c9/2bc4c9d4-3bc6-ab13-3f71-df0b89b173de/886448022213.jpg/600x600bb.jpg", album: "Fine Line" },
  "Physical|||Dua Lipa": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/87/45/78/874578c1-d683-d1e6-00e4-08848279fa3a/mzaf_17519393520049027931.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6c/11/d6/6c11d681-aa3a-d59e-4c2e-f77e181026ab/190295092665.jpg/600x600bb.jpg", album: "Future Nostalgia" },
  "As It Was|||Harry Styles": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/67/10/16/67101606-3869-ca44-6c03-e13d6322cb51/mzaf_1135399237022217274.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2a/19/fb/2a19fb85-2f70-9e44-f2a9-82abe679b88e/886449990061.jpg/600x600bb.jpg", album: "Harry's House" },
  "Flowers|||Miley Cyrus": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/68/9e/f7/689ef7fe-14fe-a846-c87f-7d3b2d6344b1/mzaf_4167137058064023087.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8c/67/ff/8c67ff91-31c3-3fef-1884-ce3ec89f3af4/196589946874.jpg/600x600bb.jpg", album: "Endless Summer Vacation" },
  "Anti-Hero|||Taylor Swift": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1d/56/2a/1d562a07-dc5f-a9c0-1f36-2051a8c14eb7/mzaf_7214829135431340590.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/3d/01/f2/3d01f2e5-5a08-835f-3d30-d031720b2b80/22UM1IM07364.rgb.jpg/600x600bb.jpg", album: "Midnights" },
  "Stay|||The Kid LAROI": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e1/2e/9a/e12e9a9d-6dc1-735e-2ce5-f1d45e8ca23b/mzaf_4716692252568031804.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f5/7a/9e/f57a9e6a-31c8-0784-dfbd-4a0120bfd4af/21UMGIM17517.rgb.jpg/600x600bb.jpg", album: "Justice" },

  // ── Indie / Rock ──
  "Mr. Brightside|||The Killers": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b3/95/6e/b3956e14-35f0-937e-afb0-72774d3f613f/mzaf_8359343604382181711.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/11/64/9c/11649c80-2066-dba8-77a9-df7eecae26c1/17UM1IM06937.rgb.jpg/600x600bb.jpg", album: "Direct Hits" },
  "Seven Nation Army|||The White Stripes": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/61/54/97/61549744-a83b-1c4d-58cf-e56b36beb4a7/mzaf_1246579179619940831.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/07/25/09/0725098a-09f4-f240-e551-94384a590371/886448799009.jpg/600x600bb.jpg", album: "Elephant" },
  "Feel Good Inc.|||Gorillaz": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/51/ec/df/51ecdf14-b30c-4e55-8d1b-67073cbc16c4/mzaf_8877212452170183777.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/0f/81/1c0f818a-e458-dd84-6f1b-ccbdf5fe14d6/825646291045.jpg/600x600bb.jpg", album: "Demon Days" },
  "Believer|||Imagine Dragons": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7d/9c/8d/7d9c8d77-dc2c-6ab5-540a-063016ea0ee2/mzaf_13607919425161609621.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/11/7a/b8/117ab805-6811-8929-18b9-0fad7baf0c25/17UMGIM98210.rgb.jpg/600x600bb.jpg", album: "Evolve" },
  "Do I Wanna Know?|||Arctic Monkeys": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/df/c3/9c/dfc39caa-a559-b5ac-5b50-472a1c300ca6/mzaf_14741548917211029550.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/cc/0f/2d/cc0f2d02-5ff1-10e7-eea2-76863a55dbad/887828031795.png/600x600bb.jpg", album: "AM" },
  "Bohemian Rhapsody|||Queen": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8f/11/52/8f1152a9-fd5f-0021-f546-b97579c22ec3/mzaf_3962258993076347789.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/08/2a/4d082a9e-7898-1aa1-a02f-339810058d9e/14DMGIM05632.rgb.jpg/600x600bb.jpg", album: "Greatest Hits I, II & III: The Platinum Collection" },
  "Somebody That I Used to Know|||Gotye": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/f9/9c/55/f99c553e-7be1-91dc-b55e-3da1aad29bba/mzaf_5038171343466446420.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b3/8a/98/b38a9867-2a9c-de2f-2d80-c624fb2200ec/11UMGIM19347.rgb.jpg/600x600bb.jpg", album: "Making Mirrors" },
  "Pumped Up Kicks|||Foster the People": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/dd/a9/80/dda980a0-3b62-f7b7-9588-11b929a30b3c/mzaf_4007504837203131685.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ba/07/5b/ba075b3c-f0c4-b519-59f3-7ae74d43246b/dj.lajxsvkg.jpg/600x600bb.jpg", album: "Torches" },

  // ── Hip-Hop ──
  "SICKO MODE|||Travis Scott": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/85/49/e2/8549e207-7ecf-21a9-7b2f-b414175c6a74/mzaf_10189975321658500285.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e7/49/8f/e7498f65-df8f-bead-d6e3-2a8d4d642a79/886447235317.jpg/600x600bb.jpg", album: "ASTROWORLD" },
  "HUMBLE.|||Kendrick Lamar": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/30/3f/27/303f27c8-1997-8c57-66b3-b67e7c720779/mzaf_5598476068977070849.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/ab/16/ef/ab16efe9-e7f1-66ec-021c-5592a23f0f9e/17UMGIM88793.rgb.jpg/600x600bb.jpg", album: "DAMN." },
  "God's Plan|||Drake": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/da/7d/f1/da7df14b-8ee6-5020-d850-ccc0381eb141/mzaf_5511967710095380808.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/6d/8f/bb6d8f67-6d04-10b5-dd62-eb5809ac54fc/00602567879152.rgb.jpg/600x600bb.jpg", album: "Scorpion" },
  "Old Town Road|||Lil Nas X": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/9b/1f/b9/9b1fb99c-9111-91da-9296-5ab8d82028ee/mzaf_11237315064991720435.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/07/d4/c3/07d4c33e-b793-d78f-bb1b-52f1e224da88/886447788264.jpg/600x600bb.jpg", album: "7" },
  "Without Me|||Eminem": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/7d/38/ff/7d38ff16-b52c-063a-a34d-767e836befcc/mzaf_13413071545825673354.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/dd/5c/e6/dd5ce621-f7d2-f767-7a08-e7a7eaa7870b/00602537526994.rgb.jpg/600x600bb.jpg", album: "The Eminem Show" },

  // ── Electronic ──
  "Animals|||Martin Garrix": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/a1/75/48/a1754841-d05c-0402-bdee-16d724ae47a2/mzaf_16624181595158272558.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6e/1e/f0/6e1ef055-195a-bb73-d5a8-5926058366a5/8712944577525.png/600x600bb.jpg", album: "Animals - Single" },
  "Wake Me Up|||Avicii": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/68/1e/60/681e601f-e1f2-4ebb-37de-adf00bdf57b6/mzaf_8266263075137964740.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/18/5b/1e/185b1ef5-5d97-19d8-aebf-8e29e41874ef/13UAAIM59255.rgb.jpg/600x600bb.jpg", album: "True" },
  "Faded|||Alan Walker": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/f4/32/01/f43201b9-4bba-7654-2e43-d59e2d907e9f/mzaf_2440137894989713967.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/0d/a3/1a/0da31af7-d0ff-9bee-c427-1b6d0336f6fc/886446321981.jpg/600x600bb.jpg", album: "Faded - EP" },
  "Titanium|||David Guetta": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/d7/31/16/d7311629-4945-2c68-38ef-2ea808582d0e/mzaf_16661300875206508900.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/77/6f/57/776f57e2-017d-ed40-8f0f-1547beb65517/190296501425.jpg/600x600bb.jpg", album: "Titanium (feat. Sia)" },
  "Lean On|||Major Lazer": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/cf/4f/9f/cf4f9f22-a272-72ae-6873-52a23afc0b98/mzaf_10354636981390731246.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/29/a7/3f/29a73f03-a1b5-c8f0-0df7-8dfe107bf929/653738300326_Cover.jpg/600x600bb.jpg", album: "Lean On - Single" },

  // ── Anime ──
  "Idol|||YOASOBI": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/c4/66/2b/c4662bbf-877c-d684-5a1c-f47d1e01cbc8/mzaf_2094216344108530658.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/76/6e/ea/766eea0b-54bb-8860-80be-c2e4101520f4/198009311613.png/600x600bb.jpg", album: "Idol (From \"Oshi No Ko\") - Single" },
  "Racing Into The Night|||YOASOBI": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0e/c1/c3/0ec1c306-abe6-9f29-2efb-ae5df908480d/mzaf_2757623543673456999.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7f/8c/90/7f8c90dd-e11f-30d5-271d-4b72eee970bd/195497666737.jpg/600x600bb.jpg", album: "THE BOOK" },
  "Gurenge|||LiSA": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/5e/02/62/5e02620e-2f05-8e17-7acd-2e4a6c52561d/mzaf_15937890891823926671.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/af/b0/2e/afb02ed7-9e22-d584-79e4-565e65a03cdd/a7da7401-65ca-4a61-a47e-1d32b6e31e80.jpg/600x600bb.jpg", album: "Gurenge (From \"Demon Slayer\") - Single" },
  "Blue Bird|||Ikimonogakari": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/63/4b/b2/634bb252-1e58-37f8-449e-2f2f4340c021/mzaf_9221704373718497901.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/48/f2/f7/48f2f77a-1229-2f65-87da-5efa9dab85b1/886445760033.jpg/600x600bb.jpg", album: "Chou Ikimonobakari Members Best Selection" },
  "Silhouette|||KANA-BOON": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/31/76/a3/3176a3c8-0465-b1fb-9a06-faf9f2423fbc/mzaf_892689947062240155.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/7b/30/aa/7b30aa0a-0b3f-bb03-4dce-70840e227444/jacket_KSCL02520B00Z_550.jpg/600x600bb.jpg", album: "Silhouette - Single" },
  "unravel|||TK from Ling tosite sigure": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/5c/6c/a7/5c6ca766-8d69-cc32-e16f-9f6bb9ed405c/mzaf_871812147337318922.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music30/v4/8f/c4/17/8fc41796-ac5b-a7eb-1154-00ba82b9da95/859717459317_cover.jpg/600x600bb.jpg", album: "Unravel (Tokyo Ghoul) - Single" },
  "Kaikai Kitan|||Eve": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/e2/53/5b/e2535b6d-3df8-0a6b-e10f-ca7a8385e1c2/mzaf_6472539432382624207.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/a8/35/f8/a835f846-6439-ae7b-9a6a-caede340f120/194152659879.png/600x600bb.jpg", album: "Kaikai Kitan (From \"Jujutsu Kaisen\") - Single" },
  "KICK BACK|||Kenshi Yonezu": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/68/66/b4/6866b432-63c1-1fc8-e46b-bc417070ed64/mzaf_6071731039862516488.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/15/32/da/1532da94-cc8b-6653-38c0-f537d34b6016/4547366595604.jpg/600x600bb.jpg", album: "KICK BACK - Single" },
  "Sparkle|||RADWIMPS": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/56/0f/14/560f1404-345d-d210-239b-3defefe3763f/mzaf_13852268595428667741.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/56/b3/8c/56b38c05-1728-402c-016c-c1e4b0635be8/4988031167618_cover.jpg/600x600bb.jpg", album: "Your Name." },
  "A Cruel Angel's Thesis|||Yoko Takahashi": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/58/a9/28/58a92819-4c5e-a96e-74cd-3a604de995b2/mzaf_7145370490049538188.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/5e/e9/62/5ee9621b-f174-38d0-fd96-12f3ee747fb7/eva_icon.jpg/600x600bb.jpg", album: "EVANGELION(8bit)" },
  "Crossing Field|||LiSA": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview113/v4/cb/cc/bd/cbccbd68-2247-9580-bc36-e3757debd116/mzaf_16869144394025933999.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/5a/85/43/5a8543b0-927f-e344-f868-0d138532785d/872133060479.png/600x600bb.jpg", album: "Link Start - EP" },
  "The Rumbling|||SiM": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/1f/9c/94/1f9c9488-e22b-37ee-0f87-11f8b8323c27/mzaf_4189924617030195397.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7a/18/87/7a1887b2-5a4b-c3ca-255d-db8a65f43245/PCSP_03935_A.jpg/600x600bb.jpg", album: "The Rumbling - Single" },
  "Guren no Yumiya|||Linked Horizon": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/93/e3/f7/93e3f754-61f0-11ec-25f6-38fea3cc719b/mzaf_10699107844703231183.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/50/50/b3/5050b320-cd45-2ad7-b1b2-1b9b473d2475/PCSP_01397_itunes.png/600x600bb.jpg", album: "Guren no Yumiya (TV Size) - Single" },
  "Cha-La Head-Cha-La|||Hironobu Kageyama": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/01/40/a5/0140a510-8583-12da-8e78-f68e2b5cac5e/mzaf_14821378674353132090.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/21/26/02/212602c9-99ee-1dfe-b2f1-ef31a583cf71/artwork.jpg/600x600bb.jpg", album: "Cha-La Head-Cha-La (From Dragon Ball Z) - Single" },
  "Tank!|||Seatbelts": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/fa/41/04/fa41047a-2eba-7b11-1ca5-74bbbc709bd8/mzaf_11134654358432867890.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5a/bb/df/5abbdf28-bf0e-0530-e5f8-0f0ca3150e0a/195081633657.jpg/600x600bb.jpg", album: "COWBOY BEBOP (Original Motion Picture Soundtrack)" },
  "Again|||YUI": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/ce/ea/e5/ceeae580-7068-484e-9f67-d8bac12ec126/mzaf_3829322613576633382.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/21/b8/a3/21b8a3a5-4374-3594-9ef3-294efc281e6a/840096168488.png/600x600bb.jpg", album: "Total Coverage, Vol. 1" },
  "Lilium|||Kumiko Noma": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/da/56/82/da5682e4-8e00-748b-72a0-442b08189349/mzaf_7278667656698679561.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1b/50/11/1b501108-dcba-df32-59d6-8397a0f1a317/r4FzB.png/600x600bb.jpg", album: "Lilium (from Elfen Lied) - Single" },
  "Pretender|||Official HIGE DANdism": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ce/0f/9c/ce0f9cf6-edfd-d964-317a-56781936a96b/mzaf_10158629645505453806.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1f/b6/36/1fb6364f-77fc-7653-3750-811631832ee9/PCCA_04785.jpg/600x600bb.jpg", album: "Pretender - Single" },
  "Mixed Nuts|||Official HIGE DANdism": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d9/08/63/d9086309-5e99-43c9-dece-8cf69b17e408/mzaf_16418685507341471716.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/9c/7d/88/9c7d883d-4477-bf68-f56f-a726030a63a2/PCCA_04822.jpg/600x600bb.jpg", album: "Traveler" },
  "Zenzenzense|||RADWIMPS": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f8/fd/9f/f8fd9f88-67e8-ce12-f44d-1b4fe421f1f9/mzaf_5313510550820503304.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/56/b3/8c/56b38c05-1728-402c-016c-c1e4b0635be8/4988031167618_cover.jpg/600x600bb.jpg", album: "Your Name." },

  // ── Hindi ──
  "Kesariya|||Arijit Singh": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/600x600bb.jpg", album: "Kesariya (From \"Brahmastra\") - Single" },
  "Tum Hi Ho|||Arijit Singh": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/38/de/b9/38deb942-d44a-f2bb-205c-ddf05be84693/mzaf_9747647124859107103.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/600x600bb.jpg", album: "Aashiqui 2 (Original Motion Picture Soundtrack)" },
  "Channa Mereya|||Arijit Singh": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d5/f9/98/d5f998a7-0090-ee2d-03f8-557ad6c5bf65/mzaf_14251357991592637728.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bc/6e/4d/bc6e4d0c-adec-b431-7b60-16f5689f9664/886446201597.jpg/600x600bb.jpg", album: "Ae Dil Hai Mushkil (Original Motion Picture Soundtrack)" },
  "Senorita|||Farhan Akhtar": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/91/64/31/9164312f-07b4-0378-2174-823a12572f10/mzaf_7630635950642986007.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/b0/3f/4c/b03f4cca-8a6a-f506-4490-3263b4fb620c/8902894696296_cover.jpg/600x600bb.jpg", album: "Zindagi Na Milegi Dobara (Original Motion Picture Soundtrack)" },
  "Gerua|||Arijit Singh": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bf/6e/24/bf6e24d8-d4d5-1cac-adc6-4a0fc07e98da/mzaf_14186979808495752044.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/dd/c8/ee/ddc8ee1d-baeb-0c8b-383f-1eb21bd172c2/886445593280.jpg/600x600bb.jpg", album: "Dilwale (Original Motion Picture Soundtrack)" },

  // ── Sports / Anthems ──
  "Waka Waka|||Shakira": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/98/88/e5/9888e55d-4daf-0e96-480b-a38259013586/mzaf_9048311608369053538.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/3e/3a/73/3e3a73da-e19e-b26c-ec19-9da6a5da93fa/mzi.ixhiugev.jpg/600x600bb.jpg", album: "Listen Up! The Official 2010 FIFA World Cup Album" },
  "We Are The Champions|||Queen": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8c/b9/38/8cb93818-d1d3-7093-8679-5a42c261b429/mzaf_826149797423692231.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/08/2a/4d082a9e-7898-1aa1-a02f-339810058d9e/14DMGIM05632.rgb.jpg/600x600bb.jpg", album: "Greatest Hits I, II & III: The Platinum Collection" },
  "We Will Rock You|||Queen": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e9/37/42/e9374231-9cef-ad56-365c-a7ba09e4fa55/mzaf_10566507321838390251.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/08/2a/4d082a9e-7898-1aa1-a02f-339810058d9e/14DMGIM05632.rgb.jpg/600x600bb.jpg", album: "Greatest Hits I, II & III: The Platinum Collection" },
  "Eye of the Tiger|||Survivor": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fe/fa/9e/fefa9edd-c023-4d1c-1012-08bfb0ec69e6/mzaf_4651653238471209843.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f9/02/8f/f9028f63-7a55-235e-f789-1e8946430fa2/614223201122.jpg/600x600bb.jpg", album: "Eye of the Tiger (Remastered)" },

  // ── Movie Themes (My Heart Will Go On removed — no iTunes data) ──
  "He's a Pirate|||Klaus Badelt": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/5e/14/f9/5e14f984-c6af-5dd4-e4ae-337d3a41ab31/mzaf_17811455529095579551.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9a/0c/05/9a0c056b-9a6a-9446-5aa2-939aa2486ef3/00050086008971.rgb.jpg/600x600bb.jpg", album: "Pirates of the Caribbean: The Curse of the Black Pearl (Original Soundtrack)" },
  "Time|||Hans Zimmer": { previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/94/9c/89/949c8995-41f8-d3c1-90eb-81c10b54133b/mzaf_8252792899119007978.plus.aac.p.m4a", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/9f/7e/60/9f7e6017-3bd3-570f-7890-eba0f3aa6c33/mzi.hxbvposl.jpg/600x600bb.jpg", album: "Inception (Music from the Motion Picture)" },
};

// ─── Reactive Store ───────────────────────────────────────────────────────────

const trackStore: Track[] = [];
const librarySubs = new Set<() => void>();
const playerSubs  = new Set<() => void>();

const notifyLibrary = () => librarySubs.forEach((fn) => fn());
const notifyPlayer  = () => playerSubs.forEach((fn) => fn());

const updateTrack = (index: number, patch: Partial<Track>) => {
  trackStore[index] = { ...trackStore[index], ...patch };
  notifyLibrary();
};

// ─── Seed Data ────────────────────────────────────────────────────────────────

const seed = (
  title: string,
  artist: string,
  category: Category,
  searchTerm?: string
): Track => {
  const key    = `${title}|||${artist}`;
  const cached = TRACK_DATA[key];
  return {
    title,
    artist,
    category,
    searchTerm:  searchTerm ?? `${title} ${artist}`,
    cover:       cached?.cover      ?? cradlesCover,
    previewUrl:  cached?.previewUrl ?? undefined,
    album:       cached?.album      ?? undefined,
    resolved:    !!cached?.previewUrl,
  };
};

// NOTE: "My Heart Will Go On" removed — no iTunes data available.
export const TRACKS: Track[] = [
  // English Mix
  seed('Cradles', 'Sub Urban', 'English Mix'),
  seed('Blinding Lights', 'The Weeknd', 'English Mix'),
  seed('Levitating', 'Dua Lipa', 'English Mix'),
  seed('bad guy', 'Billie Eilish', 'English Mix'),
  seed('Viva La Vida', 'Coldplay', 'English Mix'),
  seed('Counting Stars', 'OneRepublic', 'English Mix'),
  seed('Shape of You', 'Ed Sheeran', 'English Mix'),
  seed('Uptown Funk', 'Mark Ronson', 'English Mix'),
  seed('Watermelon Sugar', 'Harry Styles', 'English Mix'),
  seed('Physical', 'Dua Lipa', 'English Mix'),
  seed('As It Was', 'Harry Styles', 'English Mix'),
  seed('Flowers', 'Miley Cyrus', 'English Mix'),
  seed('Anti-Hero', 'Taylor Swift', 'English Mix'),
  seed('Stay', 'The Kid LAROI', 'English Mix'),

  // Indie / Rock
  seed('Mr. Brightside', 'The Killers', 'Indie / Rock'),
  seed('Seven Nation Army', 'The White Stripes', 'Indie / Rock'),
  seed('Feel Good Inc.', 'Gorillaz', 'Indie / Rock'),
  seed('Believer', 'Imagine Dragons', 'Indie / Rock'),
  seed('Do I Wanna Know?', 'Arctic Monkeys', 'Indie / Rock'),
  seed('Bohemian Rhapsody', 'Queen', 'Indie / Rock'),
  seed('Somebody That I Used to Know', 'Gotye', 'Indie / Rock'),
  seed('Pumped Up Kicks', 'Foster the People', 'Indie / Rock'),

  // Hip-Hop
  seed('SICKO MODE', 'Travis Scott', 'Hip-Hop'),
  seed('HUMBLE.', 'Kendrick Lamar', 'Hip-Hop'),
  seed("God's Plan", 'Drake', 'Hip-Hop'),
  seed('Old Town Road', 'Lil Nas X', 'Hip-Hop'),
  seed('Without Me', 'Eminem', 'Hip-Hop'),

  // Electronic
  seed('Animals', 'Martin Garrix', 'Electronic'),
  seed('Wake Me Up', 'Avicii', 'Electronic'),
  seed('Faded', 'Alan Walker', 'Electronic'),
  seed('Titanium', 'David Guetta', 'Electronic'),
  seed('Lean On', 'Major Lazer', 'Electronic'),

  // Anime
  seed('Idol', 'YOASOBI', 'Anime'),
  seed('Racing Into The Night', 'YOASOBI', 'Anime'),
  seed('Gurenge', 'LiSA', 'Anime'),
  seed('Blue Bird', 'Ikimonogakari', 'Anime'),
  seed('Silhouette', 'KANA-BOON', 'Anime'),
  seed('unravel', 'TK from Ling tosite sigure', 'Anime'),
  seed('Kaikai Kitan', 'Eve', 'Anime'),
  seed('KICK BACK', 'Kenshi Yonezu', 'Anime'),
  seed('Sparkle', 'RADWIMPS', 'Anime'),
  seed("A Cruel Angel's Thesis", 'Yoko Takahashi', 'Anime'),
  seed('Crossing Field', 'LiSA', 'Anime'),
  seed('The Rumbling', 'SiM', 'Anime'),
  seed('Guren no Yumiya', 'Linked Horizon', 'Anime'),
  seed('Cha-La Head-Cha-La', 'Hironobu Kageyama', 'Anime'),
  seed('Tank!', 'Seatbelts', 'Anime'),
  seed('Again', 'YUI', 'Anime'),
  seed('Lilium', 'Kumiko Noma', 'Anime'),
  seed('Pretender', 'Official HIGE DANdism', 'Anime'),
  seed('Mixed Nuts', 'Official HIGE DANdism', 'Anime'),
  seed('Zenzenzense', 'RADWIMPS', 'Anime'),

  // Hindi
  seed('Kesariya', 'Arijit Singh', 'Hindi'),
  seed('Tum Hi Ho', 'Arijit Singh', 'Hindi'),
  seed('Channa Mereya', 'Arijit Singh', 'Hindi'),
  seed('Senorita', 'Farhan Akhtar', 'Hindi'),
  seed('Gerua', 'Arijit Singh', 'Hindi'),

  // Sports / Anthems
  seed('Waka Waka', 'Shakira', 'Sports / Anthems'),
  seed('We Are The Champions', 'Queen', 'Sports / Anthems'),
  seed('We Will Rock You', 'Queen', 'Sports / Anthems'),
  seed('Eye of the Tiger', 'Survivor', 'Sports / Anthems'),

  // Movie Themes
  seed("He's a Pirate", 'Klaus Badelt', 'Movie Themes'),
  seed('Time', 'Hans Zimmer', 'Movie Themes'),
];

// Populate reactive store (already resolved from TRACK_DATA)
TRACKS.forEach((t) => trackStore.push({ ...t }));

const syncBackToTracks = (index: number) => {
  TRACKS[index] = { ...trackStore[index] };
};

// ─── iTunes Search (fallback for any unresolved tracks) ───────────────────────

const searchITunes = async (term: string): Promise<Partial<Track> | null> => {
  try {
    const url = `https://itunes.apple.com/search?media=music&entity=song&limit=8&term=${encodeURIComponent(term)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json: { results: any[] } = await res.json();
    const results = json.results ?? [];
    const best =
      results.find((r: any) => r.previewUrl && r.artworkUrl100) ??
      results.find((r: any) => r.previewUrl) ??
      null;
    if (!best?.previewUrl) return null;
    const cover = best.artworkUrl100
      ? best.artworkUrl100.replace('100x100bb', '600x600bb').replace('100x100', '600x600')
      : cradlesCover;
    return { album: best.collectionName ?? undefined, cover, previewUrl: best.previewUrl, resolved: true };
  } catch {
    return null;
  }
};

// ─── Fallback Enrichment (only for any still-unresolved tracks) ───────────────

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });

const MAX_RETRIES = 3;
const BATCH_SIZE  = 10;

const enrichOneTrack = async (index: number): Promise<void> => {
  const track = trackStore[index];
  if (track.resolved && track.previewUrl) return;
  const term = track.searchTerm ?? `${track.title} ${track.artist}`;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const result = await searchITunes(term);
    if (result?.previewUrl) {
      if (result.cover && result.cover !== cradlesCover) void preloadImage(result.cover);
      updateTrack(index, result);
      syncBackToTracks(index);
      return;
    }
    if (attempt < MAX_RETRIES) await sleep(800 * attempt);
  }
  // Exhausted retries — leave as unresolved (hidden from playable list)
  updateTrack(index, { resolved: false });
};

let enrichmentStarted = false;

const startEnrichment = async () => {
  if (enrichmentStarted || typeof window === 'undefined') return;
  enrichmentStarted = true;

  const missing = trackStore
    .map((_, i) => i)
    .filter((i) => !trackStore[i].resolved || !trackStore[i].previewUrl);

  if (!missing.length) {
    // All tracks already resolved from TRACK_DATA — instant load, nothing to do
    notifyLibrary();
    return;
  }

  // Only a few stragglers should end up here
  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(enrichOneTrack));
    if (i + BATCH_SIZE < missing.length) await sleep(200);
  }

  notifyLibrary();
};

if (typeof window !== 'undefined') void startEnrichment();

export const preloadTrackLibrary = () => { void startEnrichment(); };

// ─── Audio Engine ─────────────────────────────────────────────────────────────

let nowPlaying: NowPlaying = {
  ...trackStore[0],
  playing: false, progress: 0, duration: 30, currentTime: 0,
};

let playerVolume = 0.65;
let audio: HTMLAudioElement | null = null;

const getAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;
  if (audio) return audio;
  audio = new Audio();
  audio.preload     = 'metadata';
  audio.crossOrigin = 'anonymous';
  audio.volume      = playerVolume;
  audio.addEventListener('loadedmetadata', () => {
    if (!audio) return;
    nowPlaying = { ...nowPlaying, duration: Number.isFinite(audio.duration) ? audio.duration : 30 };
    notifyPlayer();
  });
  audio.addEventListener('timeupdate', () => {
    if (!audio) return;
    const dur = Number.isFinite(audio.duration) ? audio.duration : nowPlaying.duration || 30;
    nowPlaying = { ...nowPlaying, currentTime: audio.currentTime, duration: dur, progress: dur ? audio.currentTime / dur : 0 };
    notifyPlayer();
  });
  audio.addEventListener('ended',  () => nextTrack());
  audio.addEventListener('play',   () => { nowPlaying = { ...nowPlaying, playing: true  }; notifyPlayer(); });
  audio.addEventListener('pause',  () => { nowPlaying = { ...nowPlaying, playing: false }; notifyPlayer(); });
  return audio;
};

// ─── Playback API ─────────────────────────────────────────────────────────────

export const getNowPlaying = (): NowPlaying => nowPlaying;

export const setPlayerVolume = (value: number) => {
  playerVolume = Math.max(0, Math.min(1, value / 100));
  const p = getAudio();
  if (p) p.volume = playerVolume;
};

export const playTrack = async (track: Track): Promise<void> => {
  const player = getAudio();
  if (!player) return;

  let resolved: Track = { ...track };

  // If not already resolved, try a fresh iTunes lookup (on-demand fast path)
  if (!resolved.previewUrl) {
    const result = await searchITunes(track.searchTerm ?? `${track.title} ${track.artist}`);
    if (result?.previewUrl) {
      resolved = { ...resolved, ...result };
      const idx = trackStore.findIndex(t => t.title === track.title && t.artist === track.artist);
      if (idx >= 0) { updateTrack(idx, result); syncBackToTracks(idx); }
    }
  }

  if (!resolved.previewUrl) {
    nowPlaying = { ...nowPlaying, playing: false };
    notifyPlayer();
    return;
  }

  nowPlaying = { ...nowPlaying, ...resolved, playing: true, progress: 0, currentTime: 0, duration: 30 };
  notifyPlayer();

  player.src = resolved.previewUrl;
  player.currentTime = 0;
  player.volume = playerVolume;

  try { await player.play(); }
  catch { nowPlaying = { ...nowPlaying, playing: false }; notifyPlayer(); }
};

export const togglePlay = async (): Promise<void> => {
  const player = getAudio();
  if (!player) return;
  if (!player.src) { await playTrack(nowPlaying); return; }
  if (player.paused) { try { await player.play(); } catch { /* ignore */ } }
  else player.pause();
};

export const seekTo = (fraction: number): void => {
  const player = getAudio();
  if (!player) return;
  const dur = Number.isFinite(player.duration) ? player.duration : nowPlaying.duration || 30;
  player.currentTime = Math.max(0, Math.min(dur, fraction * dur));
};

// ─── Navigation ───────────────────────────────────────────────────────────────

const playable     = (): Track[] => trackStore.filter(t => t.previewUrl);
const currentIndex = (): number => {
  const list = playable();
  const i = list.findIndex(t => t.title === nowPlaying.title && t.artist === nowPlaying.artist);
  return i < 0 ? 0 : i;
};

export const nextTrack = (): void => {
  const list = playable();
  if (list.length) void playTrack(list[(currentIndex() + 1) % list.length]);
};
export const prevTrack = (): void => {
  const list = playable();
  if (list.length) void playTrack(list[(currentIndex() - 1 + list.length) % list.length]);
};

// ─── React Hooks ──────────────────────────────────────────────────────────────

export const useNowPlaying = (): NowPlaying => {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(n => n + 1);
    playerSubs.add(fn);
    return () => { playerSubs.delete(fn); };
  }, []);
  return nowPlaying;
};

export const useTrackLibrary = (): Track[] => {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(n => n + 1);
    librarySubs.add(fn);
    void startEnrichment();
    return () => { librarySubs.delete(fn); };
  }, []);
  return [...trackStore];
};
