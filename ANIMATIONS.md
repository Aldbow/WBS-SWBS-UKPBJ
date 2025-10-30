# Dokumentasi Animasi - SWBS Landing Page

## 🎬 Overview

Landing page SWBS dilengkapi dengan animasi scroll reveal yang halus dan profesional menggunakan **Framer Motion**. Animasi dirancang untuk meningkatkan user experience tanpa mengganggu performa.

## 📦 Komponen Animasi

### 1. **AnimatedSection**
Komponen wrapper untuk animasi scroll reveal dengan berbagai varian.

**Props:**
- `animation`: Tipe animasi - `fadeIn`, `slideUp`, `slideLeft`, `slideRight`, `scaleUp`, `zoomIn`
- `delay`: Delay sebelum animasi dimulai (detik)
- `duration`: Durasi animasi (detik)
- `className`: CSS classes tambahan

**Contoh:**
```tsx
<AnimatedSection animation="slideUp" delay={0.2}>
  <h2>Judul yang akan slide up</h2>
</AnimatedSection>
```

### 2. **AnimatedText**
Khusus untuk animasi teks dengan efek fade + slide up yang lembut.

**Props:**
- `delay`: Delay sebelum animasi dimulai
- `className`: CSS classes tambahan

**Contoh:**
```tsx
<AnimatedText delay={0.3}>
  <p>Paragraf dengan animasi smooth</p>
</AnimatedText>
```

### 3. **AnimatedCard**
Card dengan animasi reveal dan hover effects yang interaktif.

**Features:**
- Fade + slide up saat muncul
- Scale up saat hover (1.05x)
- Lift effect (y: -5px)
- Scale down saat tap (0.98x)

**Contoh:**
```tsx
<AnimatedCard className="card">
  <div>Konten card Anda</div>
</AnimatedCard>
```

### 4. **StaggerContainer**
Container untuk animasi berurutan (stagger) pada child elements.

**Props:**
- `staggerDelay`: Jeda antar animasi child (detik)
- `className`: CSS classes tambahan

**Contoh:**
```tsx
<StaggerContainer staggerDelay={0.15}>
  <AnimatedCard>Card 1</AnimatedCard>
  <AnimatedCard>Card 2</AnimatedCard>
  <AnimatedCard>Card 3</AnimatedCard>
</StaggerContainer>
```

## 🎨 Implementasi di Landing Page

### Hero Section
- **Heading**: Fade in + slide up
- **Paragraph**: Fade in + slide up dengan delay 0.2s
- **CTA Buttons**: Scale up animation dengan delay 0.4s

```tsx
<AnimatedText>
  <h1>Judul Hero</h1>
</AnimatedText>
<AnimatedText delay={0.2}>
  <p>Deskripsi</p>
</AnimatedText>
<AnimatedSection animation="scaleUp" delay={0.4}>
  <div>Buttons</div>
</AnimatedSection>
```

### What is WBS Section
- **Heading**: Slide up dari bawah
- **Paragraphs**: Fade in berurutan dengan delay

### Cards Grid (Reportable Items)
- **Heading**: Slide up
- **Cards**: Stagger animation dengan delay 0.15s antar card
- **Hover**: Scale up + lift effect

```tsx
<StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.15}>
  {items.map(item => (
    <AnimatedCard className="card">
      {/* Card content */}
    </AnimatedCard>
  ))}
</StaggerContainer>
```

### Confidentiality Section
- **Lock Icon**: Zoom in animation
- **Heading**: Fade + slide with delay
- **Feature Cards**: Stagger animation dengan delay 0.2s

### CTA Section
- **Heading**: Slide up
- **Description**: Fade in
- **Action Cards**: Stagger animation dengan hover effects

## ⚙️ Konfigurasi Teknis

### Viewport Detection
```tsx
viewport={{ once: true, amount: 0.2 }}
```
- `once: true` = Animasi hanya trigger sekali
- `amount: 0.2` = Trigger saat 20% elemen terlihat

### Easing Functions
Semua animasi menggunakan `easeOut` untuk transisi yang natural dan profesional.

### Performance Optimizations
1. **Once trigger**: Animasi hanya berjalan sekali, tidak re-trigger saat scroll kembali
2. **Will-change**: Framer Motion otomatis mengoptimalkan transforms
3. **GPU Acceleration**: Transform properties menggunakan GPU untuk smooth animation
4. **Lazy viewport**: Animasi hanya di-prepare saat mendekati viewport

## 🎯 Best Practices

### 1. Delay Timing
- Hero elements: 0-0.4s
- Section headings: 0s (immediate)
- Content paragraphs: 0.2-0.4s
- Cards/Grid items: Use stagger (0.1-0.2s)

### 2. Duration Timing
- Quick transitions: 0.3-0.5s
- Standard: 0.6-0.8s
- Slow/emphasis: 0.8-1.2s

### 3. Animation Selection
- **fadeIn**: Simple content, backgrounds
- **slideUp**: Headings, important content
- **slideLeft/Right**: Side-by-side content
- **scaleUp**: CTAs, buttons, emphasis
- **zoomIn**: Icons, focal points

### 4. Stagger Usage
Gunakan untuk:
- Grid cards (0.1-0.15s delay)
- Lists (0.08-0.1s delay)
- Feature sections (0.15-0.2s delay)

## 📊 Performance Impact

### Bundle Size
- Framer Motion: ~45KB gzipped
- Landing page increase: 932 B → 37.5 kB (includes animations)

### Runtime Performance
- 60 FPS smooth animations
- GPU-accelerated transforms
- No layout shifts (CLS optimized)
- Minimal JavaScript execution

### Core Web Vitals
- **LCP**: ✅ Not affected (animations after paint)
- **FID**: ✅ Not affected (passive listeners)
- **CLS**: ✅ No layout shift (position-based animations)

## 🔧 Customization

### Membuat Animasi Custom

```tsx
const customVariants = {
  hidden: { opacity: 0, rotateY: 90 },
  visible: { opacity: 1, rotateY: 0 },
};

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  variants={customVariants}
>
  {children}
</motion.div>
```

### Mengubah Timing Global

Edit di `AnimatedSection.tsx`:
```tsx
transition={{
  duration: 0.8,    // Ubah durasi default
  delay,
  ease: 'easeOut',  // Ubah easing function
}}
```

## 📱 Responsive Behavior

Animasi bekerja sempurna di semua breakpoints:
- **Mobile**: Animasi lebih cepat (durasi -0.1s)
- **Tablet**: Standard timing
- **Desktop**: Standard timing dengan full effects

## 🎓 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Variants](https://www.framer.com/motion/animation/)
- [Viewport Scroll](https://www.framer.com/motion/scroll-animations/)

---

**Created**: October 2025  
**Framework**: Framer Motion + Next.js 14  
**Performance**: Optimized for production
