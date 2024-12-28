import React from 'react';
import './Subscribe.scss';
import { Headline } from '@/shared/ui/Headline';

const SubscriptionPlans: React.FC = () => {
    return (
        <div style={{ padding: '20px'}}>
            <Headline text='Подписка'/>
            <table className="pricing-table">
                <thead>
                    <tr>
                        <th>Особенности</th>
                        <th className="free">Бесплатная</th>
                        <th className="pro">Про</th>
                        <th className="super">Супер</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Количество резюме</td>
                        <td>5</td>
                        <td>15</td>
                        <td>30</td>
                    </tr>
                    <tr>
                        <td>Персональный менеджер</td>
                        <td><span className="crossmark">✖</span></td>
                        <td><span className="crossmark">✖</span></td>
                        <td><span className="checkmark">✔</span></td>
                    </tr>
                    <tr>
                        <td>Помощь в оформлении</td>
                        <td><span className="crossmark">✖</span></td>
                        <td><span className="checkmark">✔</span></td>
                        <td><span className="checkmark">✔</span></td>
                    </tr>
                    <tr>
                        <td>Цена</td>
                        <td>Бесплатно</td>
                        <td>1000 ₸ / месяц</td>
                        <td>3999 ₸ / месяц</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><a href="#" className="subscribe-btn">Subscribe</a></td>
                        <td><a href="#" className="subscribe-btn">Subscribe</a></td>
                        <td><a href="#" className="subscribe-btn">Subscribe</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SubscriptionPlans;