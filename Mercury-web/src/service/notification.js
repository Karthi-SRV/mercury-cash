/* eslint-disable react/jsx-no-bind */
import React from "react"
import { Button, notification, Icon } from 'antd'

export const openNotification = (message, description = '') => {
    const key = `open${Date.now()}`
    const btn = (
        <Button size="small" onClick={() => notification.close(key)}>
            Confirm
        </Button>
    )
    notification.open({
        message,
        description,
        btn,
        key,
        onClose: close,
        icon: <Icon type="success" style={{ color: '#108ee9' }} />
    })
}