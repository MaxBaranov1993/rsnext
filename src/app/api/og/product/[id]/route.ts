import { ImageResponse } from 'next/og';
import { productsData, ProductId } from '@/data/products';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id as ProductId;
    const productData = productsData[productId];

    if (!productData) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8fafc',
              color: '#1e293b',
            }}
          >
            <h1 style={{ fontSize: 48, marginBottom: 16 }}>Товар не найден</h1>
            <p style={{ fontSize: 24, color: '#64748b' }}>rSALE</p>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8fafc',
            color: '#1e293b',
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* Background gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            }}
          />
          
          {/* Logo */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#f97316',
            }}
          >
            rSALE
          </div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              maxWidth: '800px',
            }}
          >
            {/* Category badge */}
            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#f97316',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '16px',
                marginBottom: '24px',
                alignSelf: 'flex-start',
              }}
            >
              {productData.category}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '24px',
                lineHeight: '1.2',
                color: '#1e293b',
              }}
            >
              {productData.title}
            </h1>

            {/* Price */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '32px',
              }}
            >
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#f97316',
                  marginRight: '16px',
                }}
              >
                {new Intl.NumberFormat('ru-RU').format(productData.price)} ₽
              </span>
              <span
                style={{
                  fontSize: '18px',
                  color: '#64748b',
                  backgroundColor: '#e2e8f0',
                  padding: '4px 12px',
                  borderRadius: '12px',
                }}
              >
                {productData.condition === 'new' ? 'Новый' : 
                 productData.condition === 'excellent' ? 'Отличное' :
                 productData.condition === 'good' ? 'Хорошее' : 'Удовлетворительное'}
              </span>
            </div>

            {/* Seller info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 'auto',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  marginRight: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#64748b',
                }}
              >
                {productData.seller.name.charAt(0)}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '4px',
                  }}
                >
                  {productData.seller.name}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#64748b',
                  }}
                >
                  ⭐ {productData.seller.rating} • {productData.seller.totalSales} объявлений
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            color: '#1e293b',
          }}
        >
          <h1 style={{ fontSize: 48, marginBottom: 16 }}>rSALE</h1>
          <p style={{ fontSize: 24, color: '#64748b' }}>Онлайн-маркетплейс</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}