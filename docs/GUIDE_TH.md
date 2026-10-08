# คู่มือ Deskly สำหรับพอร์ตฝึกงาน QA Automation

โปรเจกต์นี้เป็นร้านอุปกรณ์โต๊ะทำงานจำลอง มีบั๊กที่ตั้งใจใส่ไว้ 6 ตัว ไม่เก็บเงินจริง ไม่ส่งคำสั่งซื้อ และไม่ deploy เว็บ ตัวเว็บและ Playwright ใช้ TypeScript

## เปิดเว็บ

ติดตั้ง Node.js 22.12 ขึ้นไปหรือ Node.js 24 แล้วเปิด terminal ในโฟลเดอร์โปรเจกต์:

```sh
npm ci
npx playwright install chromium firefox
npm run dev
```

เข้า http://127.0.0.1:5173 ใช้ Ctrl+C เพื่อหยุดเว็บ ถ้าอยากดูเวอร์ชันแก้บั๊ก ให้ใช้ `npm run dev:fixed` แทน

## ลองทดสอบ

- `npm test`: เว็บมีบั๊ก โดย 17 เคสต่อ browser ต้องผ่าน และอีก 6 เคสต้องพบ known defect ตามที่ระบุ
- `npm run test:audit`: เปิดให้บั๊ก 6 ตัวขึ้นเป็น failed ปกติบน Chromium เหมาะสำหรับสาธิตรายงาน ระบบจะคืน exit code ที่ไม่ใช่ศูนย์โดยตั้งใจ
- `npm run test:fixed`: ใช้ assertion เดิมกับเวอร์ชันแก้บั๊ก ทุกเคสควรผ่าน
- `npm run report`: เปิดรายงานล่าสุด ดูรูป วิดีโอ และ trace ของเคสที่ล้มเหลว

มี 23 เคส × 3 browser configurations = 69 executions ในแต่ละ full run โดย mobile เป็นการจำลอง Pixel 7 บน Chromium ไม่ใช่มือถือจริง รายงานจะถูกแทนที่เมื่อรันชุดถัดไป

รายงาน baseline ที่เขียวไม่ได้แปลว่าเว็บไม่มีบั๊ก: `test.fail` บอกว่าบั๊กนั้นต้องเกิดขึ้นจริง หากเทสต์ที่ระบุ known defect กลับผ่าน จะถือว่า unexpected pass เพื่อให้กลับมาทบทวนสถานะบั๊ก ไม่ใช้ skip เพื่อเลี่ยงการทดสอบ

## แนวทางเล่าให้ผู้สัมภาษณ์ฟัง

1. เริ่มที่กฎค่าส่ง: subtotal ตั้งแต่ 2,000 บาทต้องส่งฟรี
2. อธิบาย boundary value: ต่ำกว่า / เท่ากับ / สูงกว่า threshold
3. สาธิต TC-021: lamp 1,200 + catchall 800 แล้วดูว่าค่าส่งยังเป็น 100
4. เปิด BUG-005 อธิบาย expected/actual, impact และ severity
5. เปิด audit report ให้เห็น assertion และภาพหลักฐาน
6. รัน fixed mode เพื่อแสดงว่าเทสต์เดิมผ่านหลังเปลี่ยนเงื่อนไขเป็น inclusive threshold

อ่านและปรับโปรเจกต์เองก่อนส่งสมัครงาน เพิ่ม exploratory tests ที่คุณคิดได้ และอธิบายส่วนที่ใช้ AI ช่วยอย่างตรงไปตรงมา ไม่ควรอ้างว่างานครอบคลุมระบบชำระเงินจริงหรือ backend เพราะโปรเจกต์นี้ไม่มีส่วนเหล่านั้น

## ส่งขึ้น GitHub

ทำตามคำสั่งใน README โดยเปลี่ยนชื่อบัญชี GitHub เป็นของคุณ โฟลเดอร์ node_modules, dist และรายงานที่สร้างระหว่างรันไม่ต้อง commit แต่ package-lock.json และเอกสาร QA ต้องอยู่ใน repo เมื่อ push แล้ว GitHub Actions จะรันทั้ง buggy/fixed mode และแนบผลทดสอบเป็น artifacts
