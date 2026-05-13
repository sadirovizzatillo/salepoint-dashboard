import { useRef } from 'react'
import { Button, Spin, Tooltip, message } from 'antd'
import {
  CloudUploadOutlined,
  DeleteOutlined,
  PictureOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { useUploadProductImage, useRemoveProductImage } from '@/hooks/useProductImage'
import { ALLOWED_IMAGE_MIMES, MAX_IMAGE_BYTES } from '@/types/product.types'
import { validateImage } from '@/utils/image'

interface Props {
  productId: string | null
  imageUrl?: string | null
  size?: number
  disabledHint?: string
}

export default function ProductImageUploader({
  productId,
  imageUrl,
  size = 120,
  disabledHint = "Avval mahsulotni saqlang, so'ng rasm qo'shing",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = useUploadProductImage()
  const remove = useRemoveProductImage()

  const disabled = !productId
  const busy = upload.isPending || remove.isPending

  const onPickClick = () => {
    if (disabled) return message.info(disabledHint)
    inputRef.current?.click()
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !productId) return

    const err = validateImage(file)
    if (err) return message.error(err.message)

    upload.mutate({ productId, file })
  }

  const onRemove = () => {
    if (!productId) return
    remove.mutate(productId)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          border: '1px dashed #cbd5e1',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'relative',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="product"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <PictureOutlined style={{ fontSize: 28, color: '#cbd5e1' }} />
        )}
        {busy && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spin />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Tooltip title={disabled ? disabledHint : undefined}>
          <Button
            icon={imageUrl ? <SwapOutlined /> : <CloudUploadOutlined />}
            onClick={onPickClick}
            disabled={disabled || busy}
            style={{ borderRadius: 8 }}
          >
            {imageUrl ? "O'zgartirish" : 'Rasm yuklash'}
          </Button>
        </Tooltip>
        {imageUrl && (
          <Button
            icon={<DeleteOutlined />}
            onClick={onRemove}
            danger
            disabled={disabled || busy}
            style={{ borderRadius: 8 }}
          >
            O'chirish
          </Button>
        )}
        <div style={{ fontSize: 11, color: '#94a3b8' }}>
          JPG, PNG, WEBP — maks. {Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_MIMES.join(',')}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </div>
  )
}
