import {useIntl} from 'react-intl'
import {KTIcon} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'

const SidebarMenuMain = () => {
  const intl = useIntl()

  return (
    <>
      <SidebarMenuItemWithSub
        to='/dashboard'
        icon='element-11'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItemWithSub to='/builder' icon='switch' title='Monitoring' fontIcon='bi-layers' />
      
      <SidebarMenuItemWithSub
        to='/crafted/pages'
        title='Trips'
        fontIcon='bi-archive'
        icon='element-plus'
      >
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/crafted/geofence'
        title='Geofence'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItemWithSub to='/crafted/geofence/overview' title='Geofence' hasBullet={true} />
        <SidebarMenuItemWithSub to='/crafted/geofence/settings' title='Linked Geofence' hasBullet={true} />
        <SidebarMenuItemWithSub to='/crafted/geofence/settings' title='Add Geofence' hasBullet={true} />
      </SidebarMenuItemWithSub>


      <SidebarMenuItemWithSub
        to='/crafted/reservation'
        title='Reservation'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItemWithSub to='/crafted/reservation/overview' title='Add Reservation' hasBullet={true} />
        <SidebarMenuItemWithSub to='/crafted/reservation/settings' title='reservations' hasBullet={true} />
      </SidebarMenuItemWithSub>


      <SidebarMenuItemWithSub
        to='/crafted/customer'
        title='Customer'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItemWithSub to='/crafted/customer/overview' title='Customers' hasBullet={true} />
        <SidebarMenuItemWithSub to='/crafted/customer/settings' title='Add Customer' hasBullet={true} />
      </SidebarMenuItemWithSub>


      <SidebarMenuItemWithSub
        to='/crafted/vehicle'
        title='Vehicle'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItemWithSub to='/crafted/vehicle/overview' title='Vehicles' hasBullet={true} />
        <SidebarMenuItemWithSub to='/crafted/vehicle/settings' title='Add Vehicle' hasBullet={true} />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to='/crafted/maintenance'
        title='Maintenance'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItemWithSub to='/crafted/maintenance/overview' title='Maintenance' hasBullet={true} />
        <SidebarMenuItemWithSub to='/crafted/maintenance/settings' title='Add Maintenance' hasBullet={true} />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to='/crafted/device'
        title='device'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItemWithSub to='/crafted/device/overview' title='devices' hasBullet={true} />
        <SidebarMenuItemWithSub to='/crafted/device/settings' title='Add Device' hasBullet={true} />
      </SidebarMenuItemWithSub>


      <SidebarMenuItemWithSub
        to='/crafted/user'
        title='User'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItemWithSub to='/crafted/user/overview' title='users' hasBullet={true} />
        <SidebarMenuItemWithSub to='/crafted/user/settings' title='Add User' hasBullet={true} />
      </SidebarMenuItemWithSub>





      <SidebarMenuItemWithSub
        to='/crafted/driver'
        title='driver'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItemWithSub to='/crafted/driver/overview' title='drivers' hasBullet={true} />
        <SidebarMenuItemWithSub to='/crafted/driver/settings' title='Add Driver' hasBullet={true} />
      </SidebarMenuItemWithSub>


      <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={import.meta.env.VITE_APP_PREVIEW_DOCS_URL + '/changelog'}
        >
          <span className='menu-icon'>
            <KTIcon iconName='code' className='fs-2' />
          </span>
          <span className='menu-title'>Changelog {import.meta.env.VITE_APP_VERSION}</span>
        </a>
      </div>
    </>
  )
}

export {SidebarMenuMain}
