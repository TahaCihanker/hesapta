import { Compass } from 'lucide-react'
import { Link } from 'react-router'
import { buttonClass } from '../components/ui/buttonStyles'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <Card>
      <EmptyState
        icon={Compass}
        title="Sayfa bulunamadı"
        description="Aradığın sayfa taşınmış ya da hiç var olmamış olabilir."
        action={
          <Link to="/" className={buttonClass('primary')}>
            Özete dön
          </Link>
        }
      />
    </Card>
  )
}
