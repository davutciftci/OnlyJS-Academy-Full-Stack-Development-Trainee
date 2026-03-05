import { OrderWithRelations, OrderItemWithVariant } from '../types';

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #2563eb;
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 20px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
    }
    a {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
    }
    .order-details {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .product-item {
      border-bottom: 1px solid #dee2e6;
      padding: 10px 0;
    }
    .product-item:last-child {
      border-bottom: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏋️DC Protein Shop</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</p>
      <p>&copy; 2026 DC Protein Shop. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>
`;

export const welcomeEmail = (firstName: string) => {
  const content = `
    <h2>Hoş Geldiniz ${firstName}! 🎉</h2>
    <p>DC Protein Shop ailesine katıldığınız için teşekkür ederiz!</p>
    <p>Hesabınız başarıyla oluşturuldu. Artık en kaliteli protein ürünlerine kolayca ulaşabilirsiniz.</p>
    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button text-white">
      Alışverişe Başla
    </a>
    <p>Sorularınız için bizimle iletişime geçebilirsiniz.</p>
  `;

  return baseTemplate(content);
};

export const orderConfirmationEmail = (order: OrderWithRelations) => {
  const itemsHtml = order.items.map((item: OrderItemWithVariant) => `
    <div class="product-item">
      <strong>${item.productName} - ${item.variantName}</strong><br>
      Miktar: ${item.quantity} x ${item.price} TL = ${item.subtotal} TL
    </div>
  `).join('');

  const content = `
    <h2>Siparişiniz Alındı! ✅</h2>
    <p>Merhaba ${order.user.firstName},</p>
    <p>Siparişiniz başarıyla alınmıştır. Sipariş detaylarınız aşağıdadır:</p>
    
    <div class="order-details">
      <p><strong>Sipariş No:</strong> ${order.orderNumber}</p>
      <p><strong>Sipariş Tarihi:</strong> ${new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
      <p><strong>Durum:</strong> Beklemede</p>
    </div>

    <h3>Ürünler:</h3>
    ${itemsHtml}

    <div class="order-details">
      <p><strong>Ara Toplam:</strong> ${order.subtotal} TL</p>
      <p><strong>Kargo:</strong> ${order.shippingCost} TL</p>
      <h3 style="margin: 10px 0;"><strong>Toplam:</strong> ${order.totalAmount} TL</h3>
    </div>

    <h3>Teslimat Adresi:</h3>
    <div class="order-details">
      <p><strong>${order.shippingAddress.fullName}</strong></p>
      <p>${order.shippingAddress.addressLine1}</p>
      ${order.shippingAddress.addressLine2 ? `<p>${order.shippingAddress.addressLine2}</p>` : ''}
      <p>${order.shippingAddress.district}, ${order.shippingAddress.city}</p>
      <p>Tel: ${order.shippingAddress.phoneNumber}</p>
    </div>

    <a href="${process.env.FRONTEND_URL}/hesabim?tab=orders" class="button">
      Sipariş Detaylarını Gör
    </a>

    <p>Ödemeniz onaylandıktan sonra siparişiniz hazırlanmaya başlanacaktır.</p>
  `;

  return baseTemplate(content);
};

export const orderShippedEmail = (order: OrderWithRelations) => {
  const content = `
    <h2>Siparişiniz Kargoya Verildi! 📦</h2>
    <p>Merhaba ${order.user.firstName},</p>
    <p><strong>${order.orderNumber}</strong> numaralı siparişiniz kargoya verilmiştir.</p>
    
    <div class="order-details">
      <p><strong>Kargo Takip No:</strong> ${order.trackingNumber || 'Henüz eklenmedi'}</p>
      <p><strong>Kargoya Verilme Tarihi:</strong> ${order.shippedAt ? new Date(order.shippedAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</p>
    </div>

    <p>Kargonuzu aşağıdaki linkten takip edebilirsiniz:</p>
    <a href="${process.env.FRONTEND_URL}/hesabim?tab=orders" class="button">
      Kargonu Takip Et
    </a>

    <p>Tahmini teslimat süresi: 2-3 iş günü</p>
  `;

  return baseTemplate(content);
};

export const orderCancelledEmail = (order: OrderWithRelations) => {
  const content = `
    <h2>Siparişiniz İptal Edildi</h2>
    <p>Merhaba ${order.user.firstName},</p>
    <p><strong>${order.orderNumber}</strong> numaralı siparişiniz iptal edilmiştir.</p>
    
    <div class="order-details">
      <p><strong>İptal Nedeni:</strong> ${order.cancelReason || 'Belirtilmemiş'}</p>
      <p><strong>İptal Tarihi:</strong> ${order.cancelledAt ? new Date(order.cancelledAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</p>
      <p><strong>Toplam Tutar:</strong> ${order.totalAmount} TL</p>
    </div>

    <p>Ödeme yaptıysanız, iade işleminiz 3-5 iş günü içinde hesabınıza yansıyacaktır.</p>

    <a href="${process.env.FRONTEND_URL}" class="button">
      Alışverişe Devam Et
    </a>

    <p>Sorularınız için bizimle iletişime geçebilirsiniz.</p>
  `;

  return baseTemplate(content);
};

export const orderConfirmedEmail = (order: OrderWithRelations) => {
  const content = `
    <h2>Siparişiniz Onaylandı! ✅</h2>
    <p>Merhaba ${order.user.firstName},</p>
    <p><strong>${order.orderNumber}</strong> numaralı siparişiniz onaylanmıştır.</p>
    
    <div class="order-details">
      <p><strong>Ödeme Durumu:</strong> Ödeme Alındı</p>
      <p><strong>Onay Tarihi:</strong> ${order.paidAt ? new Date(order.paidAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</p>
    </div>

    <p>Siparişiniz hazırlanmaya başlanmıştır. Kargoya verildiğinde bilgilendirileceksiniz.</p>

    <a href="${process.env.FRONTEND_URL}/hesabim?tab=orders" class="button">
      Sipariş Detaylarını Gör
    </a>
  `;

  return baseTemplate(content);
};

export const orderDeliveredEmail = (order: OrderWithRelations) => {
  const content = `
    <h2>Siparişiniz Teslim Edildi! 🎉</h2>
    <p>Merhaba ${order.user.firstName},</p>
    <p><strong>${order.orderNumber}</strong> numaralı siparişiniz teslim edilmiştir.</p>
    
    <div class="order-details">
      <p><strong>Teslim Tarihi:</strong> ${order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</p>
    </div>

    <p>Ürünlerimizi beğendiğinizi umuyoruz! Deneyiminizi bizimle paylaşmak isterseniz yorum bırakabilirsiniz.</p>

    <a href="${process.env.FRONTEND_URL}/hesabim?tab=orders" class="button">
      Sipariş Detaylarını Gör
    </a>

    <p>Bizi tercih ettiğiniz için teşekkür ederiz!</p>
  `;

  return baseTemplate(content);
};

export const passwordResetEmail = (firstName: string, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/sifre-sifirla?token=${resetToken}`;

  const content = `
    <h2>Şifre Sıfırlama Talebi</h2>
    <p>Merhaba ${firstName},</p>
    <p>Şifrenizi sıfırlamak için bir talepte bulundunuz.</p>
    <p>Aşağıdaki butona tıklayarak yeni şifrenizi oluşturabilirsiniz:</p>
    
    <a href="${resetUrl}" class="button text-white">
      Şifremi Sıfırla
    </a>

    <p>Bu link <strong>1 saat</strong> geçerlidir.</p>
    <p>Eğer bu talebi siz oluşturmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
    
    <p style="color: #6c757d; font-size: 12px;">
      Buton çalışmıyorsa şu linki kopyalayın: ${resetUrl}
    </p>
  `;

  return baseTemplate(content);
};

export const contactFormEmail = (
  firstName: string,
  lastName: string,
  email: string,
  message: string
) => {
  const content = `
    <h2> Yeni İletişim Formu Mesajı</h2>
    <p>Sitenizden yeni bir iletişim mesajı geldi:</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 12px 0;">
        <strong style="color: #2563eb; font-size: 14px;"> Ad Soyad:</strong><br/>
        <span style="color: #333; font-size: 16px; font-weight: 500;">${firstName} ${lastName}</span>
      </p>
      
      <p style="margin: 12px 0;">
        <strong style="color: #2563eb; font-size: 14px;"> E-posta:</strong><br/>
        <a href="mailto:${email}" style="color: #ffffff !important; font-size: 15px; text-decoration: underline;">${email}</a>
      </p>
      
      <div style="margin-top: 20px;">
        <p style="margin-bottom: 10px;">
          <strong style="color: #2563eb; font-size: 14px;"> Mesaj:</strong>
        </p>
        <div style="background-color: #ffffff; padding: 16px; border-left: 4px solid #2563eb; border-radius: 4px; color: #333; font-size: 15px; line-height: 1.6;">
          ${message.replace(/\n/g, '<br/>')}
        </div>
      </div>
    </div>
    
    <p style="color: #6c757d; font-size: 13px; margin-top: 20px;">
      Bu mesaja yanıt vermek için yukarıdaki e-posta adresini kullanabilirsiniz.
    </p>
  `;

  return baseTemplate(content);
};

export const verificationEmail = (firstName: string, code: string) => {
  const content = `
    <h2>Doğrulama Kodunuz</h2>
    <p>Merhaba ${firstName},</p>
    <p>DC Protein Shop'a kaydolduğunuz için teşekkürler! Üyeliğinizi tamamlamak için lütfen aşağıdaki 6 haneli doğrulama kodunu kullanın:</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb;">${code}</span>
    </div>

    <p>Bu kod <strong>15 dakika</strong> geçerlidir.</p>
    <p>Eğer bu işlemi siz yapmadıysanız lütfen bu e-postayı dikkate almayın.</p>
  `;

  return baseTemplate(content);
};

export const passwordUpdatedEmail = (firstName: string) => {
  const content = `
    <h2>Şifreniz Güncellendi 🔒</h2>
    <p>Merhaba ${firstName},</p>
    <p>Hesabınızın şifresi az önce başarıyla güncellendi.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #333; font-size: 15px;">
        Bu işlemi <strong>siz gerçekleştirdiyseniz</strong> herhangi bir işlem yapmanıza gerek yoktur.
      </p>
    </div>

    <p style="color: #6c757d; font-size: 14px;">
      Bu değişikliği <strong>siz yapmadıysanız</strong>, lütfen bizimle hemen iletişime geçin.
    </p>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">
      Hesabınıza Giriş Yapın
    </a>
  `;

  return baseTemplate(content);
};
