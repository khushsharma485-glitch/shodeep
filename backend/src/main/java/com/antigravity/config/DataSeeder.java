package com.antigravity.config;

import com.antigravity.model.*;
import com.antigravity.repository.ProductRepository;
import com.antigravity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedProducts();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@antigravity.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@antigravity.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin user created: admin@antigravity.com / admin123");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            List<Product> products = List.of(
                    Product.builder()
                            .name("Wireless Noise-Cancelling Headphones")
                            .description(
                                    "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality.")
                            .price(new BigDecimal("299.99"))
                            .stock(50)
                            .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500")
                            .category("Electronics")
                            .build(),
                    Product.builder()
                            .name("Mechanical Gaming Keyboard")
                            .description(
                                    "RGB backlit mechanical keyboard with Cherry MX switches, programmable keys, and aircraft-grade aluminum frame.")
                            .price(new BigDecimal("149.99"))
                            .stock(75)
                            .imageUrl("https://images.unsplash.com/photo-1541140532154-b024d1b2e4a4?w=500")
                            .category("Electronics")
                            .build(),
                    Product.builder()
                            .name("Ultra-Slim Laptop Stand")
                            .description(
                                    "Ergonomic aluminum laptop stand with adjustable height, foldable design, and universal compatibility.")
                            .price(new BigDecimal("49.99"))
                            .stock(120)
                            .imageUrl("https://images.unsplash.com/photo-1527434305953-39e8daab4abb?w=500")
                            .category("Accessories")
                            .build(),
                    Product.builder()
                            .name("Smart Fitness Watch")
                            .description(
                                    "Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life.")
                            .price(new BigDecimal("199.99"))
                            .stock(90)
                            .imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500")
                            .category("Wearables")
                            .build(),
                    Product.builder()
                            .name("Premium Leather Backpack")
                            .description(
                                    "Handcrafted genuine leather backpack with laptop compartment, anti-theft design, and water-resistant finish.")
                            .price(new BigDecimal("129.99"))
                            .stock(60)
                            .imageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500")
                            .category("Fashion")
                            .build(),
                    Product.builder()
                            .name("Portable Bluetooth Speaker")
                            .description(
                                    "Waterproof Bluetooth speaker with 360° sound, 20-hour battery, and built-in microphone for calls.")
                            .price(new BigDecimal("79.99"))
                            .stock(100)
                            .imageUrl("https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500")
                            .category("Electronics")
                            .build(),
                    Product.builder()
                            .name("Minimalist Desk Lamp")
                            .description(
                                    "LED desk lamp with touch controls, adjustable brightness, wireless charging base, and sleek design.")
                            .price(new BigDecimal("59.99"))
                            .stock(85)
                            .imageUrl("https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500")
                            .category("Home")
                            .build(),
                    Product.builder()
                            .name("Stainless Steel Water Bottle")
                            .description(
                                    "Double-wall vacuum insulated bottle, keeps drinks cold 24hrs or hot 12hrs, BPA-free, 750ml capacity.")
                            .price(new BigDecimal("34.99"))
                            .stock(200)
                            .imageUrl("https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500")
                            .category("Lifestyle")
                            .build());
            productRepository.saveAll(products);
            log.info("✅ {} sample products seeded", products.size());
        }
    }
}
